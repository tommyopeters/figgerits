export default class Figgeritz {
    private quote: string = '';
    private encoding: { [key: string]: number } = {};
    public userInput: { [key: number]: string } = {};

    setQuote(value: string): void {
        if (value && value.trim().length > 0) {
            this.quote = value;
        }
    }

    getQuote(): string {
        return this.quote;
    }

    getEncoding(): { [key: string]: number } {
        return this.encoding;
    }

    getUniqueCharacters(paragraph: string): string[] {
        const uniqueCharacters: string[] = [];
        const characters: string[] = paragraph.toLowerCase().match(/[a-z]/g) || [];

        for (const char of characters) {
            if (!uniqueCharacters.includes(char)) {
                uniqueCharacters.push(char);
            }
        }

        return uniqueCharacters;
    }

    encodeLetters(paragraph: string): { [key: string]: number } {
        const uniqueCharacters = this.getUniqueCharacters(paragraph);
        const encodedLetters: { [key: string]: number } = {};

        for (const char of uniqueCharacters) {
            const randomNum = Math.floor(Math.random() * 40);
            encodedLetters[char] = randomNum;
        }

        this.encoding = encodedLetters;
        return encodedLetters;
    }
}