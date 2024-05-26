// Function to open the selected tab
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}



document.addEventListener('DOMContentLoaded', function () {
    const defaultQuote = "I’m not a morning person. I’m a coffee person.";
    const defaultAuthor = "CoffeeGuy";
    const defaultIcon = "<i class='fas fa-coffee'></i>";

    function getElementValue(id, defaultValue) {
        const element = document.getElementById(id);
        if (element) {
            return element.value || defaultValue;
        } else {
            console.error(`Element with ID ${id} not found`);
            return defaultValue;
        }
    }

    function getRandomLightColor() {
        const letters = 'BCDEF'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }

    function getRandomDarkColor() {
        const letters = '0123456'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }

    function generateQuote() {
        try {
            const font = getElementValue('font-select', 'Caladea');
            const colorSchemeElement = document.querySelector('input[name="color-scheme"]:checked');
            const colorScheme = colorSchemeElement ? colorSchemeElement.value : 'light';
            const fontColor = colorScheme === 'dark' ? getRandomLightColor() : getRandomDarkColor();
            const fontSize = getElementValue('font-size', '32');
            const borderThickness = 2;  // Default value since border-thickness element is not present
            const gradientColor1 = getElementValue('gradient-color1-hex', '#0d1b2a');
            const gradientColor2 = getElementValue('gradient-color2-hex', '#1b263b');
            const gradientDirection = 'to right';
            const backgroundImage = getElementValue('background-image', '');
            const fontIcon = getElementValue('font-icon', defaultIcon);
            const text = getElementValue('quote-text', defaultQuote);
            const author = getElementValue('author', defaultAuthor);
            const alignText = getElementValue('align-text', 'center');

            const outputDiv = document.getElementById('quote-output');
            outputDiv.classList.remove('hidden');
            outputDiv.style.color = fontColor;
            outputDiv.style.fontFamily = font;
            outputDiv.style.textAlign = alignText;
            outputDiv.style.borderColor = fontColor;
            outputDiv.style.borderStyle = 'solid';
            outputDiv.style.borderWidth = `${borderThickness}px`;
            outputDiv.style.backgroundImage = `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`;
            outputDiv.style.fontSize = `${fontSize}px`;

            if (backgroundImage) {
                outputDiv.style.backgroundImage = `url(${backgroundImage}), linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`;
                outputDiv.style.backgroundSize = 'cover';
            } else {
                outputDiv.style.backgroundImage = `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`;
            }

            const iconOutput = document.getElementById('icon-output');
            iconOutput.style.color = fontColor;
            iconOutput.innerHTML = fontIcon;

            const quoteTextOutput = document.getElementById('quote-text-output');
            quoteTextOutput.innerHTML = text;

            const authorOutput = document.getElementById('author-output');
            authorOutput.innerHTML = `- ${author}`;

            outputDiv.style.boxShadow = `0px 0px 10px ${fontColor}`;

            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}&display=swap`;
            document.head.appendChild(fontLink);

            document.getElementById('export-jpg').classList.remove('hidden');
            document.getElementById('export-png').classList.remove('hidden');
        } catch (error) {
            console.error('Error generating quote:', error);
        }
    }

    function exportImage(format) {
        const outputDiv = document.getElementById('quote-output');
        html2canvas(outputDiv).then(canvas => {
            const link = document.createElement('a');
            link.download = `quote.${format}`;
            link.href = canvas.toDataURL(`image/${format}`);
            link.click();
        }).catch(error => {
            console.error('Error exporting image:', error);
        });
    }

    function autofillFields() {
        const fileInput = document.getElementById('data-file');
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a data.csv file first.');
            return;
        }

        Papa.parse(file, {
            complete: function (results) {
                const data = results.data;
                if (data.length <= 1) {
                    alert('No data found in the selected file.');
                    return;
                }

                const cleanedData = data.map(row => {
                    const cleanedRow = {};
                    Object.keys(row).forEach(key => {
                        cleanedRow[key.trim().replace(/^"|"$/g, '')] = row[key].trim().replace(/^"|"$/g, '');
                    });
                    return cleanedRow;
                });

                const randomRow = cleanedData[Math.floor(Math.random() * cleanedData.length)];

                const requiredKeys = ['Quote', 'Author', 'Icon', 'color1', 'color2'];
                const missingKeys = requiredKeys.filter(key => !randomRow.hasOwnProperty(key));

                if (missingKeys.length > 0) {
                    console.error('Missing required keys:', missingKeys);
                    alert('Invalid data format. Missing keys: ' + missingKeys.join(', '));
                    return;
                }

                if (document.getElementById('quote-checkbox').checked) {
                    document.getElementById('quote-text').value = randomRow.Quote;
                }
                if (document.getElementById('author-checkbox').checked) {
                    document.getElementById('author').value = randomRow.Author;
                }
                if (document.getElementById('font-icon-checkbox').checked) {
                    document.getElementById('font-icon').value = randomRow.Icon;
                }
                if (randomRow.type && randomRow.type.toLowerCase() === 'dark') {
                    document.getElementById('color-scheme-dark').checked = true;
                } else {
                    document.getElementById('color-scheme-light').checked = true;
                }
                if (document.getElementById('align-text-checkbox').checked) {
                    document.getElementById('align-text').value = getRandomValueFromSelect('align-text');
                }
                if (document.getElementById('font-select-checkbox').checked) {
                    document.getElementById('font-select').value = getRandomValueFromSelect('font-select');
                }
                if (document.getElementById('gradient-color1-hex-checkbox').checked) {
                    document.getElementById('gradient-color1-hex').value = randomRow.color1;
                }
                if (document.getElementById('gradient-color2-hex-checkbox').checked) {
                    document.getElementById('gradient-color2-hex').value = randomRow.color2;
                }
                if (document.getElementById('font-size-checkbox').checked) {
                    document.getElementById('font-size').value = Math.floor(Math.random() * (64 - 24 + 1)) + 24; // Random size between 24 and 64
                }

                generateQuote();
            },
            header: true,
            skipEmptyLines: true
        });
    }

    function getRandomValueFromSelect(id) {
        const select = document.getElementById(id);
        if (select) {
            const options = select.options;
            const randomIndex = Math.floor(Math.random() * options.length);
            return options[randomIndex].value;
        }
        return null;
    }

    function importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                const settings = JSON.parse(event.target.result);
                Object.keys(settings).forEach(key => {
                    const element = document.getElementById(key);
                    if (element) {
                        element.value = settings[key];
                    }
                });
                generateQuote();
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function exportSettings() {
        const settings = {};
        document.querySelectorAll('input, select').forEach(element => {
            settings[element.id] = element.value;
        });
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'settings.json';
        link.click();
    }

    // Function to open the selected tab
    function openTab(evt, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    // Attach event listeners to input elements
    function attachEventListeners() {
        const authorInput = document.getElementById('author');
        if (authorInput) authorInput.addEventListener('input', generateQuote);

        const backgroundImageInput = document.getElementById('background-image');
        if (backgroundImageInput) backgroundImageInput.addEventListener('input', generateQuote);

        const alignTextInput = document.getElementById('align-text');
        if (alignTextInput) alignTextInput.addEventListener('change', generateQuote);

        const fontIconInput = document.getElementById('font-icon');
        if (fontIconInput) fontIconInput.addEventListener('input', generateQuote);

        const fontSizeInput = document.getElementById('font-size');
        if (fontSizeInput) fontSizeInput.addEventListener('input', generateQuote);

        const autofillBtn = document.getElementById('autofill-btn');
        if (autofillBtn) {
            autofillBtn.addEventListener('click', () => {
                autofillFields();
                generateQuote();
            });
        }

        const exportJpgBtn = document.getElementById('export-jpg');
        if (exportJpgBtn) exportJpgBtn.addEventListener('click', () => exportImage('jpeg'));

        const exportPngBtn = document.getElementById('export-png');
        if (exportPngBtn) exportPngBtn.addEventListener('click', () => exportImage('png'));

        const importSettingsBtn = document.getElementById('import-settings');
        if (importSettingsBtn) importSettingsBtn.addEventListener('click', importSettings);

        const exportSettingsBtn = document.getElementById('export-settings');
        if (exportSettingsBtn) exportSettingsBtn.addEventListener('click', exportSettings);
    }

    // Function to handle selectable button clicks
    function handleSelectableButtonClick() {
        const buttons = document.querySelectorAll('.selectable-button');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                buttons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                updateSlider(this.dataset.option);
            });
        });
    }

    // Function to update the slider based on the selected option
    function updateSlider(option) {
        let max;
        switch (option) {
            case 'width':
                max = 700;
                break;
            case 'height':
                max = 900;
                break;
            case 'quote-font-size':
                max = 64;
                break;
            case 'author-font-size':
                max = 32;
                break;
            default:
                max = 100;
        }
        $('#dynamic-slider').attr('max', max);
        $('#dynamic-slider-label').text(`Adjust ${option.replace(/-/g, ' ')}`);
    }

    // Event listener for dynamic slider to update the value display
    $('#dynamic-slider').on('input', function() {
        const value = $(this).val();
        $('#dynamic-slider-value').text(value + 'px');
        const activeButton = document.querySelector('.selectable-button.active');
        if (activeButton) {
            const option = activeButton.dataset.option;
            applySliderValue(option, value);
        }
        generateQuote(); // Real-time update
    });

    // Function to apply the slider value to the corresponding input
function applySliderValue(option, value) {
    switch (option) {
        case 'width':
            document.getElementById('width-slider').value = value;
            break;
        case 'height':
            document.getElementById('height-slider').value = value;
            break;
        case 'quote-font-size':
            document.getElementById('quote-font-size-slider').value = value;
            break;
        case 'author-font-size':
            document.getElementById('author-font-size-slider').value = value;
            break;
    }
}


    // Fetch Google Fonts and populate the font select dropdown
    function fetchGoogleFonts() {
        fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyAhyTmgVuOlcPZTGbfR-Vg5nVrORDbB-yI`)
            .then(response => response.json())
            .then(data => {
                if (data.items) {
                    const fonts = data.items;
                    fonts.forEach(font => {
                        const option = document.createElement('option');
                        option.value = font.family;
                        option.textContent = font.family;
                        document.getElementById('font-select').appendChild(option);
                    });
                } else {
                    console.error('No fonts found in the response');
                }
            })
            .catch(error => {
                console.error('Error fetching Google Fonts:', error);
                const fallbackFonts = ['Arial', 'Verdana', 'Tahoma', 'Georgia', 'Times New Roman', 'Courier New'];
                fallbackFonts.forEach(font => {
                    const option = document.createElement('option');
                    option.value = font;
                    option.textContent = font;
                    document.getElementById('font-select').appendChild(option);
                });
            });
    }

    // Initial setup function
    function init() {
        attachEventListeners();
        handleSelectableButtonClick();
        fetchGoogleFonts();
        generateQuote();
        document.getElementsByClassName("tablink")[0].click(); // Open the first tab by default
    }

    // Run the initial setup
    init();
});
