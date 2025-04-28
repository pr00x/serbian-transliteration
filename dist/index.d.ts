/**
 * Options for skipping specific words or regions during the Cyrillic transliteration process.
 *
 * @typedef {Object} ToCyrillicSkipOptions
 * @property {boolean} [caseSensitive] - Whether skip word and marker matching should be case-sensitive.
 * @property {string[]} [words] - An array of words that should be excluded from transliteration.
 * @property {[string, string]} [markers] - A tuple containing the opening and closing marker strings that
 *   denote regions to be skipped during transliteration (e.g., ["<skip>", "</skip>"]).
 */
export type ToCyrillicSkipOptions = {
    caseSensitive?: boolean;
    words?: string[];
    markers?: [string, string];
};
/**
 * Main options object for Cyrillic transliteration.
 *
 * @typedef {Object} ToCyrillicOptions
 * @property {ToCyrillicSkipOptions} [skip] - Options for skipping words or regions during transliteration.
 */
export type ToCyrillicOptions = {
    skip?: ToCyrillicSkipOptions;
};
/**
 * A lightweight Serbian transliteration library for converting between Cyrillic and Latin scripts.
 */
export default class SerbianTransliteration {
    private static readonly cyrillic2LatinMap;
    private static readonly latin2CyrillicMap;
    private static readonly digraphRegexps;
    private static readonly digraphExceptionPatterns;
    private static readonly ZWNJ;
    private static readonly SKIP_PREFIX;
    private static readonly default2CyrillicOptions;
    /**
     * Handles digraph exceptions in Serbian Latin script by temporarily marking them with a zero-width non-joiner character.
     * This prevents incorrect conversion of certain digraphs to Cyrillic.
     *
     * @param {string} text - Input text in Latin script.
     * @returns {string} The text with marked exceptions to prevent unwanted digraph conversion.
     * @private
     */
    private static handleDigraphExceptions;
    /**
     * Converts a Serbian Cyrillic-script string to Latin script.
     *
     * @param {string} text - The input text in Serbian Cyrillic script.
     * @returns {string} The text converted to Serbian Latin script.
     *
     * @example
     * SerbianTransliteration.toLatin("Добар дан") // "Dobar dan"
     */
    static toLatin(text: string): string;
    /**
     * Converts a Serbian Latin-script string to Cyrillic script, with options to skip specific words, regions, or both.
     *
     * You may skip transliteration for:
     * - Words containing q, w, y, or x (always skipped).
     * - User-specified words (via `skip.words`).
     * - Regions enclosed by marker pairs (via `skip.markers`); marker tags are removed, content is preserved.
     * Both `skip.words` and `skip.markers` can be used together.
     *
     * @param {string} text - The input text in Serbian Latin script.
     * @param {ToCyrillicOptions} [options] - Optional settings for skipping words or regions.
     * @returns {string} The text converted to Serbian Cyrillic, with skipped segments preserved in the original script and markers removed.
     * @throws {Error} If the opening and closing markers are identical.
     *
     * @example
     * SerbianTransliteration.toCyrillic("Dobar dan") // "Добар дан"
     * SerbianTransliteration.toCyrillic("Visit Wikipedia", { skip: { words: ["Visit", "Wikipedia"] } }) // "Visit Wikipedia"
     * SerbianTransliteration.toCyrillic("ovo je <skip>some code</skip>", { skip: { markers: ["<skip>", "</skip>"] } }) // "ово је some code"
     */
    static toCyrillic(text: string, options?: ToCyrillicOptions): string;
    private static countCyrillicAndLatinLetters;
    /**
     * Detects whether the provided text is primarily written in Cyrillic script.
     *
     * The function compares the number of recognizable Cyrillic and Latin letters.
     * Returns true only if the count of Cyrillic letters is greater than the count of Latin letters and at least one Cyrillic letter is present.
     * If the text contains only non-letter characters or the counts are equal, returns false.
     *
     * @param {string} text - Text to analyze.
     * @returns {boolean} True if the text is primarily Cyrillic, false otherwise.
     *
     * @example
     * SerbianTransliteration.isCyrillic("Добар дан") // true
     * SerbianTransliteration.isCyrillic("Dobar dan") // false
     * SerbianTransliteration.isCyrillic("Добар Dobar") // false
     * SerbianTransliteration.isCyrillic("1234!?") // false
     */
    static isCyrillic(text: string): boolean;
    /**
     * Detects whether the provided text is primarily written in Latin script.
     *
     * The function compares the number of recognizable Latin and Cyrillic letters.
     * Returns true only if the count of Latin letters is greater than the count of Cyrillic letters and at least one Latin letter is present.
     * If the text contains only non-letter characters or the counts are equal, returns false.
     *
     * @param {string} text - Text to analyze.
     * @returns {boolean} True if the text is primarily Latin, false otherwise.
     *
     * @example
     * SerbianTransliteration.isLatin("Dobar dan") // true
     * SerbianTransliteration.isLatin("Добар дан") // false
     * SerbianTransliteration.isLatin("Добар Dobar") // false
     * SerbianTransliteration.isLatin("1234!?") // false
     */
    static isLatin(text: string): boolean;
    /**
     * Automatically detects the script of the input text (Latin or Cyrillic) and converts it to the opposite script.
     *
     * @param {string} text - Text in either Serbian Latin or Cyrillic script.
     * @param {ToCyrillicOptions} [options] - Optional settings for skipping words or regions (if the text is transliterated to Cyrillic).
     * @returns {string} The converted text in the opposite script.
     *
     * @example
     * SerbianTransliteration.autoTransliterate("Dobar dan") // "Добар дан"
     * SerbianTransliteration.autoTransliterate("Добар дан") // "Dobar dan"
     */
    static autoTransliterate(text: string, options?: ToCyrillicOptions): string;
}
