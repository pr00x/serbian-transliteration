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
    skip?: ToCyrillicSkipOptions
};

type LetterCount = {
    cyrillic: number; 
    latin: number;
};

/**
 * A lightweight Serbian transliteration library for converting between Cyrillic and Latin scripts.
 */
export default class SerbianTransliteration {
    private static readonly cyrillic2LatinMap: Readonly<Record<string, string>> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'đ', 'е': 'e',
        'ж': 'ž', 'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj',
        'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
        'т': 't', 'ћ': 'ć', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'č',
        'џ': 'dž', 'ш': 'š',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ђ': 'Đ', 'Е': 'E',
        'Ж': 'Ž', 'З': 'Z', 'И': 'I', 'Ј': 'J', 'К': 'K', 'Л': 'L', 'Љ': 'Lj',
        'М': 'M', 'Н': 'N', 'Њ': 'Nj', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S',
        'Т': 'T', 'Ћ': 'Ć', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Č',
        'Џ': 'Dž', 'Ш': 'Š'
    };
    private static readonly latin2CyrillicMap: Readonly<Record<string, string>> = {
        'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'đ': 'ђ', 'e': 'е',
        'ž': 'ж', 'z': 'з', 'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'л', 'm': 'м',
        'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'ć': 'ћ',
        'u': 'у', 'f': 'ф', 'h': 'х', 'c': 'ц', 'č': 'ч', 'š': 'ш',
        'A': 'А', 'B': 'Б', 'V': 'В', 'G': 'Г', 'D': 'Д', 'Đ': 'Ђ', 'E': 'Е',
        'Ž': 'Ж', 'Z': 'З', 'I': 'И', 'J': 'Ј', 'K': 'К', 'L': 'Л', 'M': 'М',
        'N': 'Н', 'O': 'О', 'P': 'П', 'R': 'Р', 'S': 'С', 'T': 'Т', 'Ć': 'Ћ',
        'U': 'У', 'F': 'Ф', 'H': 'Х', 'C': 'Ц', 'Č': 'Ч', 'Š': 'Ш'
    };

    // Each entry: [regexp, corresponding Cyrillic letter]
    private static readonly digraphRegexps: ReadonlyArray<[RegExp, string]> = [
        [/Lj/g, 'Љ'], [/Nj/g, 'Њ'], [/Dž/g, 'Џ'],
        [/lj/g, 'љ'], [/nj/g, 'њ'], [/dž/g, 'џ']    
    ];
    private static readonly digraphExceptionPatterns: Readonly<Record<string, RegExp[]>> = {
        'dj': [
            /adjektiv/gi, /adjunkt/gi, /bazdje/gi, /bdje/gi, /bezdje/gi, /blijedje/gi, /bludje/gi,
            /bridjе/gi, /vidjel/gi, /vidjet/gi, /vindjakn/gi, /višenedje/gi, /vrijedje/gi, /gdje/gi,
            /gudje/gi, /gdjir/gi, /daždje/gi, /dvonedje/gi, /devetonedje/gi, /desetonedje/gi, /djb/gi,
            /djeva/gi, /djevi/gi, /djevo/gi, /djed/gi, /djejstv/gi, /djel/gi, /djenem/gi,
            /djeneš/gi, /djenu/gi, /djet/gi, /djec/gi, /dječ/gi, /djuar/gi, /djubison/gi,
            /djubouz/gi, /djuer/gi, /djui/gi, /djuks/gi, /djulej/gi, /djumars/gi, /djupont/gi,
            /djurant/gi, /djusenberi/gi, /djuharst/gi, /djuherst/gi, /dovdje/gi, /dogrdje/gi, /dodjel/gi,
            /drvodje/gi, /drugdje/gi, /elektrosnabdje/gi, /žudje/gi, /zabludje/gi, /zavidje/gi, /zavrijedje/gi,
            /zagudje/gi, /zadjev/gi, /zadjen/gi, /zalebdje/gi, /zaludje/gi, /zaodje/gi, /zapodje/gi,
            /zarudje/gi, /zasjedje/gi, /zasmrdje/gi, /zastidje/gi, /zaštedje/gi, /zdje/gi, /zlodje/gi,
            /igdje/gi, /izbledje/gi, /izblijedje/gi, /izvidje/gi, /izdjejst/gi, /izdjelj/gi, /izludje/gi,
            /isprdje/gi, /jednonedje/gi, /kojegdje/gi, /kudjelj/gi, /lebdje/gi, /ludjel/gi, /ludjet/gi,
            /makfadjen/gi, /marmadjuk/gi, /međudjel/gi, /nadjaha/gi, /nadjača/gi, /nadjeb/gi, /nadjev/gi,
            /nadjenul/gi, /nadjenuo/gi, /nadjenut/gi, /negdje/gi, /nedjel/gi, /nadjunač/gi, /nenadjača/gi,
            /nenavidje/gi, /neodje/gi, /nepodjarm/gi, /nerazdje/gi, /nigdje/gi, /obdjel/gi, /obnevidje/gi,
            /ovdje/gi, /odjav/gi, /odjah/gi, /odjaš/gi, /odjeb/gi, /odjev/gi, /odjed/gi,
            /odjezd/gi, /odjek/gi, /odjel/gi, /odjen/gi, /odjeć/gi, /odjec/gi, /odjur/gi,
            /odsjedje/gi, /ondje/gi, /opredje/gi, /osijedje/gi, /osmonedje/gi, /pardju/gi, /perdju/gi,
            /petonedje/gi, /poblijedje/gi, /povidje/gi, /pogdjegdje/gi, /pogdje/gi, /podjakn/gi, /podjamč/gi,
            /podjemč/gi, /podjar/gi, /podjeb/gi, /podjebrad/gi, /podjed/gi, /podjezič/gi, /podjel/gi,
            /podjen/gi, /podjet/gi, /pododjel/gi, /pozavidje/gi, /poludje/gi, /poljodjel/gi, /ponegdje/gi,
            /ponedjelj/gi, /porazdje/gi, /posijedje/gi, /posjedje/gi, /postidje/gi, /potpodjel/gi, /poštedje/gi,
            /pradjed/gi, /prdje/gi, /preblijedje/gi, /previdje/gi, /predvidje/gi, /predjel/gi, /preodjen/gi,
            /preraspodje/gi, /presjedje/gi, /pridjev/gi, /pridjen/gi, /prismrdje/gi, /prištedje/gi, /probdje/gi,
            /problijedje/gi, /prodjen/gi, /prolebdje/gi, /prosijedje/gi, /prosjedje/gi, /protivdjel/gi, /prošlonedje/gi,
            /razvidje/gi, /razdjev/gi, /razdjel/gi, /razodje/gi, /raspodje/gi, /rasprdje/gi, /remekdjel/gi,
            /rudjen/gi, /rudjet/gi, /sadje/gi, /svagdje/gi, /svidje/gi, /svugdje/gi, /sedmonedjelj/gi,
            /sijedje/gi, /sjedje/gi, /smrdje/gi, /snabdje/gi, /snovidje/gi, /starosjedje/gi, /stidje/gi,
            /studje/gi, /sudjel/gi, /tronedje/gi, /ublijedje/gi, /uvidje/gi, /udjel/gi, /udjen/gi,
            /uprdje/gi, /usidjel/gi, /usjedje/gi, /usmrdje/gi, /uštedje/gi, /cjelonedje/gi, /četvoronedje/gi,
            /čukundjed/gi, /šestonedjelj/gi, /štedje/gi, /štogdje/gi, /šukundjed/gi
        ],
        'dž': [
            /feldžandarm/gi, /nadžanj/gi, /nadždrel/gi, /nadžel/gi, /nadžeo/gi, /nadžet/gi, /nadživ/gi,
            /nadžinj/gi, /nadžnj/gi, /nadžrec/gi, /nadžup/gi, /odžali/gi, /odžari/gi, /odžel/gi, /odžive/gi,
            /odživljava/gi, /odžubor/gi, /odžvaka/gi, /odžval/gi, /odžvać/gi, /podžanr/gi, /podžel/gi,
            /podže/gi, /podžig/gi, /podžiz/gi, /podžil/gi, /podžnje/gi, /podžupan/gi, /predželu/gi, /predživot/gi
        ],
        'nj': [
            /anjon/gi, /injaric/gi, /injekc/gi, /injekt/gi, /injicira/gi, /injurij/gi, /kenjon/gi, /konjug/gi,
            /konjunk/gi, /nekonjug/gi, /nekonjunk/gi, /ssrnj/gi, /tanjug/gi, /vanjezičk/gi
        ]
    };

    // Zero-width non-joiner character to prevent digraph conversion
    private static readonly ZWNJ: string = '\u200C';
    private static readonly SKIP_PREFIX: string = '\uE000__SKIP__';
    private static readonly default2CyrillicOptions: Readonly<ToCyrillicOptions> = {
        skip: {
            caseSensitive: true,
            words: [],
            markers: ['<skip>', '</skip>']
        }
    };

    /**
     * Handles digraph exceptions in Serbian Latin script by temporarily marking them with a zero-width non-joiner character.
     * This prevents incorrect conversion of certain digraphs to Cyrillic.
     *
     * @param {string} text - Input text in Latin script.
     * @returns {string} The text with marked exceptions to prevent unwanted digraph conversion.
     * @private
     */
    private static handleDigraphExceptions(text: string): string {
        let result: string = text;

        for (const [digraph, exceptionPatterns] of Object.entries(this.digraphExceptionPatterns)) {
            for (const pattern of exceptionPatterns) {
                result = result.replace(pattern, (match) => 
                    match.replace(
                        new RegExp(digraph, 'g'),
                        digraph[0] + this.ZWNJ + digraph[1]
                    )
                );
            }
        }

        return result;
    }


    /**
     * Converts a Serbian Cyrillic-script string to Latin script.
     *
     * @param {string} text - The input text in Serbian Cyrillic script.
     * @returns {string} The text converted to Serbian Latin script.
     *
     * @example
     * SerbianTransliteration.toLatin("Добар дан") // "Dobar dan"
     */
    public static toLatin(text: string): string {
        if (!text) {
            return '';
        }

        let result: string = '';

        for (const char of text) {
            result += this.cyrillic2LatinMap[char] ?? char;
        }

        return result;
    }

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
    public static toCyrillic(text: string, options?: ToCyrillicOptions): string {
        if (!text) {
            return '';
        }

        const skip: ToCyrillicSkipOptions = {
            caseSensitive: options?.skip?.caseSensitive ?? this.default2CyrillicOptions.skip!.caseSensitive,
            words: options?.skip?.words ?? this.default2CyrillicOptions.skip!.words,
            markers: options?.skip?.markers ?? this.default2CyrillicOptions.skip!.markers
        };

        const handleSkipMarkers: boolean = Array.isArray(skip.markers) && skip.markers.length === 2;
        const handleSkipWords: boolean = Array.isArray(skip.words) && skip.words.length > 0;
        const regexFlags: string = skip.caseSensitive ? 'g' : 'gi';
        let workingText: string = text;

        // Ensure the opening and closing markers are not the same
        if (handleSkipMarkers && skip.markers![0] === skip.markers![1]) {
            throw new Error('The opening and closing markers cannot be the same.');
        }

        // Utility for escaping regex special characters
        const escapeRegExp = (str: string): string => {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        // [Handle skip markers (e.g., <skip>...</skip>)]
        const markerReplacement: string[] = [];

        if (handleSkipMarkers) {
            const [open, close]: [string, string] = skip.markers!;
            const regex: RegExp = new RegExp(escapeRegExp(open) + '(.*?)' + escapeRegExp(close), regexFlags);
            let i: number = 0;
    
            workingText = workingText.replace(regex, (_, content) => {
                markerReplacement.push(content);
                return `${this.SKIP_PREFIX}MARKER_${i++}__`;
            });
        }

        // [Handle skip words]
        const skipReplacement: string[] = [];
        const containsEnglishLetter = (word: string): boolean => /[qwyxQWYX]/.test(word);

        // Mark all words with english letters q, w, y & x
        workingText = workingText.replace(/\b\w+\b/g, (word) => {
            if (containsEnglishLetter(word)) {
                skipReplacement.push(word);
                return `${this.SKIP_PREFIX}WORD_${skipReplacement.length - 1}__`;
            }

            return word;
        });

        if (handleSkipWords) {
            skip.words!.forEach((word) => {
                // Word boundaries, global, case-sensitive or not
                const regex: RegExp = new RegExp(
                    `(^|[^\\p{L}\\p{N}_])(${escapeRegExp(word)})(?=[^\\p{L}\\p{N}_]|$)`,
                    regexFlags + 'u'
                );
                workingText = workingText.replace(regex, (matched) => {
                    skipReplacement.push(matched); // Store the matched word
                    return `${this.SKIP_PREFIX}WORD_${skipReplacement.length - 1}__`;
                });
            });
        }
        
        // [Normal transliteration]
        let result: string = this.handleDigraphExceptions(workingText);

        // Handle digraphs
        for (const [regexps, cyrillic] of this.digraphRegexps) {
            result = result.replace(regexps, cyrillic);
        }

        let cyrillicResult: string = '';
        let i: number = 0;

        while (i < result.length) {
            let nextMarker: number = result.indexOf(this.SKIP_PREFIX, i);
            
            // Don't transliterate placeholder, add it as-is
            if (nextMarker === i) {
                let end: number = result.indexOf('__', i + this.SKIP_PREFIX.length);

                if (end !== -1) {
                    end += 2; // Because __
                    cyrillicResult += result.slice(i, end);
                    i = end;
                }
            }
            else {
                const char = result[i];

                if (char !== this.ZWNJ) {
                    cyrillicResult += this.latin2CyrillicMap[char] ?? char;
                }

                i++;
            }
        }

        result = cyrillicResult;

        // [Restore skip markers]
        if (markerReplacement.length > 0) {
            for (let i: number = 0; i < markerReplacement.length; i++) {
                result = result.replace(`${this.SKIP_PREFIX}MARKER_${i}__`, markerReplacement[i]);
            }
        }

        // [Restore skip words]
        if (skipReplacement.length > 0) {
            for (let i: number = 0; i < skipReplacement.length; i++) {
                result = result.replace(`${this.SKIP_PREFIX}WORD_${i}__`, skipReplacement[i]);
            }
        }
        
        // Remove any ZWNJ characters and return
        return result.replace(new RegExp(this.ZWNJ, 'g'), '');
    }

    private static countCyrillicAndLatinLetters(text: string): LetterCount {
        let cyrillicChars: number = 0;
        let latinChars: number = 0;

        for (const char of text) {
            if (this.cyrillic2LatinMap[char] !== undefined) {
                cyrillicChars++;
            }
            else if (this.latin2CyrillicMap[char] !== undefined) {
                latinChars++;
            }
        }

        return {
            cyrillic: cyrillicChars,
            latin: latinChars
        };
    }

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
    public static isCyrillic(text: string): boolean {
        if (!text) {
            return false;
        }

        const letters: LetterCount = this.countCyrillicAndLatinLetters(text);
        return letters.cyrillic > letters.latin;
    }

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
    public static isLatin(text: string): boolean {
        if (!text) {
            return false;
        }

        const letters: LetterCount = this.countCyrillicAndLatinLetters(text);
        return letters.latin > letters.cyrillic;
    }

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
    public static autoTransliterate(text: string, options?: ToCyrillicOptions): string {
        if (!text) {
            return '';
        }

        if (this.isCyrillic(text)) {
            return this.toLatin(text);
        }
        else if (this.isLatin(text)) {
            return this.toCyrillic(text, options);
        }
        
        return text;
    }
}