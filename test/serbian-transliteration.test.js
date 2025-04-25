import SerbianTransliteration from '../dist/index.js';

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        throw new Error(message);
    }

    console.log(`✅ PASSED: ${message}`);
}

// Test suite
function runTests() {
    console.log('Running Serbian Transliteration Tests...');

    // Test toLatin
    function testToLatin() {
        console.log('\n--- Testing toLatin ---');

        // Basic transliteration
        assert(
            SerbianTransliteration.toLatin('Добар дан') === 'Dobar dan',
            'Basic Cyrillic to Latin conversion'
        );

        // Special characters
        assert(
            SerbianTransliteration.toLatin('Љубав, Њежност, Џем') === 'Ljubav, Nježnost, Džem',
            'Special digraph characters conversion'
        );

        // Mixed content
        assert(
            SerbianTransliteration.toLatin('Београд (Belgrade)') === 'Beograd (Belgrade)',
            'Mixed Cyrillic and non-Cyrillic content'
        );

        // Empty string
        assert(
            SerbianTransliteration.toLatin('') === '',
            'Empty string handling'
        );

        // Null/undefined handling
        assert(
            SerbianTransliteration.toLatin() === '',
            'Undefined input handling'
        );
    }

    // Test toCyrillic
    function testToCyrillic() {
        console.log('\n--- Testing toCyrillic ---');

        // Basic transliteration
        assert(
            SerbianTransliteration.toCyrillic('Dobar dan') === 'Добар дан',
            'Basic Latin to Cyrillic conversion'
        );

        // Special digraphs
        assert(
            SerbianTransliteration.toCyrillic('Ljubav, Nježnost, Džem') === 'Љубав, Њежност, Џем',
            'Special digraph characters conversion'
        );

        // Test skipping words with English letters
        assert(
            SerbianTransliteration.toCyrillic('JavaScript je quick!') === 'ЈаваСцрипт је quick!',
            'Words with q, w, y, x are automatically skipped'
        );

        // Skip specific words
        assert(
            SerbianTransliteration.toCyrillic('Visit Wikipedia', {
                skip: {
                    words: ['Visit', 'Wikipedia']
                }
            }) === 'Visit Wikipedia',
            'Skip specific words'
        );

        // Skip marked regions
        assert(
            SerbianTransliteration.toCyrillic('ovo je <skip>some code</skip> za primer', {
                skip: {
                    markers: ['<skip>', '</skip>']
                }
            }) === 'ово је some code за пример',
            'Skip marked regions'
        );

        // Test case sensitivity
        assert(
            SerbianTransliteration.toCyrillic('Test TEST test', {
                skip: {
                    words: ['TEST'],
                    caseSensitive: true
                }
            }) === 'Тест TEST тест',
            'Case sensitive word skipping'
        );

        // Test case insensitivity
        assert(
            SerbianTransliteration.toCyrillic('Test TEST test', {
                skip: {
                    words: ['test'],
                    caseSensitive: false
                }
            }) === 'Test TEST test',
            'Case insensitive word skipping'
        );

        // Test digraph exceptions
        assert(
            SerbianTransliteration.toCyrillic('injekcionu terapiju') === 'инјекциону терапију',
            'Digraph exception handling for "nj"'
        );

        assert(
            SerbianTransliteration.toCyrillic('nadživeti') === 'надживети',
            'Digraph exception handling for "dž"'
        );

        assert(
            SerbianTransliteration.toCyrillic('adjektiv') === 'адјектив',
            'Digraph exception handling for "dj"'
        );

        // Test error handling
        let errorThrown = false;
        try {
            SerbianTransliteration.toCyrillic('test', {
                skip: {
                    markers: ['<tag>', '<tag>']
                }
            });
        } catch (e) {
            errorThrown = true;
            assert(
                e.message === 'The opening and closing markers cannot be the same.',
                'Error for identical markers'
            );
        }

        assert(errorThrown, 'Exception thrown for identical markers');

        // Empty string
        assert(
            SerbianTransliteration.toCyrillic('') === '',
            'Empty string handling'
        );

        // Null/undefined handling
        assert(
            SerbianTransliteration.toCyrillic() === '',
            'Undefined input handling'
        );
    }

    // Test script detection
    function testScriptDetection() {
        console.log('\n--- Testing Script Detection ---');

        // isCyrillic tests
        assert(
            SerbianTransliteration.isCyrillic('Добар дан') === true,
            'Cyrillic detection - pure Cyrillic'
        );

        assert(
            SerbianTransliteration.isCyrillic('Dobar dan') === false,
            'Cyrillic detection - pure Latin'
        );

        assert(
            SerbianTransliteration.isCyrillic('Добар Dobar') === false,
            'Cyrillic detection - equal mix'
        );

        assert(
            SerbianTransliteration.isCyrillic('Добар д') === true,
            'Cyrillic detection - mostly Cyrillic'
        );

        assert(
            SerbianTransliteration.isCyrillic('123!@#') === false,
            'Cyrillic detection - non-letter characters'
        );

        assert(
            SerbianTransliteration.isCyrillic('') === false,
            'Cyrillic detection - empty string'
        );

        // isLatin tests
        assert(
            SerbianTransliteration.isLatin('Dobar dan') === true,
            'Latin detection - pure Latin'
        );

        assert(
            SerbianTransliteration.isLatin('Добар дан') === false,
            'Latin detection - pure Cyrillic'
        );

        assert(
            SerbianTransliteration.isLatin('Dobar Добар') === false,
            'Latin detection - equal mix'
        );

        assert(
            SerbianTransliteration.isLatin('Dobar d') === true,
            'Latin detection - mostly Latin'
        );

        assert(
            SerbianTransliteration.isLatin('123!@#') === false,
            'Latin detection - non-letter characters'
        );

        assert(
            SerbianTransliteration.isLatin('') === false,
            'Latin detection - empty string'
        );
    }

    // Test autoTransliterate
    function testAutoTransliterate() {
        console.log('\n--- Testing autoTransliterate ---');

        assert(
            SerbianTransliteration.autoTransliterate('Dobar dan') === 'Добар дан',
            'Auto transliterate Latin to Cyrillic'
        );

        assert(
            SerbianTransliteration.autoTransliterate('Добар дан') === 'Dobar dan',
            'Auto transliterate Cyrillic to Latin'
        );

        assert(
            SerbianTransliteration.autoTransliterate('123!@#') === '123!@#',
            'Auto transliterate non-letter characters'
        );

        assert(
            SerbianTransliteration.autoTransliterate('') === '',
            'Auto transliterate empty string'
        );

        // Mixed content - should default based on which script is more prevalent
        assert(
            SerbianTransliteration.autoTransliterate('Dobar Добар дан') === 'Dobar Dobar dan',
            'Auto transliterate mixed content with more Cyrillic'
        );

        assert(
            SerbianTransliteration.autoTransliterate('Dobar dan Добар') === 'Добар дан Добар',
            'Auto transliterate mixed content with more Latin'
        );
    }

    // Run all tests
    try {
        testToLatin();
        testToCyrillic();
        testScriptDetection();
        testAutoTransliterate();
        console.log('\n✅ All tests passed successfully!');
    } catch (error) {
        console.error('\n❌ Tests failed:', error.message);
    }
}

// Execute tests
runTests();