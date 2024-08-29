import { auth, provider } from "@/config/firebase";
import axios from "axios";
import authorizedAxios from "@/config/axios";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useCookies } from "vue3-cookies";
import { createStore } from "vuex";
import { get } from "node_modules/axios/index.d.cts";

const { cookies } = useCookies();

const store = createStore({
  state: {
    user: null,
    puzzle: null,
    errorActive: false,
    error: null,
  },
  getters: {
    signedIn(state: any) {
      return state.user !== null;
    },
  },
  mutations: {
    setUser(state: any, payload: any) {
      state.user = payload;
    },
    setError(state: any, payload: any) {
      state.errorActive = true;
      state.error = payload;
    },
    clearError(state: any) {
      state.errorActive = false;
      state.error = null;
    },
    setPuzzle(state: any, payload: any) {
      state.puzzle = payload;
    },
  },
  actions: {
    async signup(context: any, payload: { email: string, password: string }) {
      console.log("signup", payload);

      const res = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
      console.log("res", res);
      if (res) {
        const user = res.user;
        const idToken = await user.getIdToken()
        const refreshToken = user.refreshToken;
        cookies.set("token", idToken);
        cookies.set("refreshToken", refreshToken);
        context.commit("setUser", user);

        axios.post('http://localhost:8000/api/auth', {
          ...user
        }).then(res => {
          console.log(res.data)
        }).catch(err => {
          console.error(err)
        })
      } else {
        throw new Error("Failed to sign up");
      }
    },
    async login(context: any, payload: { email: string, password: string }) {
      console.log("login", payload);

      const res = await signInWithEmailAndPassword(auth, payload.email, payload.password);
      console.log("res", res);
      if (res) {
        const user = res.user;
        const idToken = await user.getIdToken()
        const refreshToken = user.refreshToken;
        cookies.set("token", idToken);
        cookies.set("refreshToken", refreshToken);
        context.commit("setUser", user);
      } else {
        throw new Error("Failed to login");
      }
    },
    async loginWithGoogle(context: any) {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result)!;
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          const idToken = await user.getIdToken()
          const refreshToken = user.refreshToken;

          console.log(user, token, idToken)

          cookies.set("token", idToken);
          cookies.set("refreshToken", refreshToken);
          context.commit("setUser", user);

          axios.post('http://localhost:8000/api/auth', {
            ...user
          }).then(res => {
            console.log(res.data)
          }).catch(err => {
            console.error(err)
          })
        }).catch((error) => {
          if (error.code === 'auth/popup-blocked') {
            console.error("Popup blocked. Please allow popups for this site.");
            alert("Popup blocked. Please allow popups for this site.");
          }
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...

          console.error(error)
          context.commit("setError", error.message)
        })
    },
    async logout(context: any) {
      console.log("logout");

      await auth.signOut();
      cookies.remove("token");
      context.commit("setUser", null);
    },
    async checkUserState(context: any) {
      const idToken = cookies.get("idToken");
      const refreshToken = cookies.get("refreshToken");

      console.log("checkUserState", idToken, refreshToken);
      if (idToken && refreshToken) {
        const user = await axios.post('http://localhost:8000/api/auth/verifyToken', {
          idToken,
          refreshToken
        }).then(res => {
          console.log(res.data)
          return res.data
        }).catch(err => {
          console.error(err)
          return null
        })
        if (user) {
          context.commit("setUser", user);
        } else {
          context.commit("setUser", null);
        }
      } else if (refreshToken) {
        const response = await axios.post('http://localhost:8000/api/auth/refreshToken', { refreshToken });

        // Update the token in cookies
        const newToken = response.data.idToken;
        cookies.set('idToken', newToken);

        const user = await axios.post('http://localhost:8000/api/auth/verifyToken', {
          idToken: newToken,
          refreshToken
        }).then(res => {
          console.log(res.data)
          return res.data
        }).catch(err => {
          console.error(err)
          return null
        })
        if (user) {
          context.commit("setUser", user);
        } else {
          context.commit("setUser", null);
        }
      }
    },

    async fetchPuzzle(context: any) {
      console.log("fetchPuzzle");

      const res = await authorizedAxios.get("/api/puzzle");
      console.log("res", res);
      if (res) {
        context.commit("setPuzzle", res.data);
      } else {
        throw new Error("Failed to fetch puzzle");
      }
    }
  },
  modules: {},
});

export default store;