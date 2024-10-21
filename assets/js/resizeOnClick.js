document.addEventListener('turbo:load', () => {
    const handleResize = () => {
        const isMobileView = window.innerWidth < 745;
        const list = document.querySelector('#inbox_panel');
        const detail = document.querySelector('#thread_panel');
        let backButton = document.querySelector('#backButton'); 

        const links = document.querySelectorAll('.pg07rzn');

        if (!backButton) {
            backButton = document.createElement('button');
            backButton.id = 'backButton';
            backButton.className = '_1lizyuv';
            backButton.style.display = 'none';
            backButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-label="back arrow" role="img" focusable="false" style="display: block; fill: none; height: 16px; width: 16px; stroke: currentcolor; stroke-width: 3; overflow: visible;">
                    <g fill="none">
                        <path d="M4 16h26M15 28 3.7 16.7a1 1 0 0 1 0-1.4L15 4"></path>
                    </g>
                </svg>
            `;
            document.body.appendChild(backButton);
        }

        const backButtonContainer = detail.querySelector('.lbzxe2l');
        if (backButtonContainer && backButton) {
            backButtonContainer.appendChild(backButton);
        }

        if (list && detail && links.length > 0) {
            links.forEach(link => {
                link.removeEventListener('click', handleLinkClick);
                link.addEventListener('click', handleLinkClick);
            });

            function handleLinkClick(event) {
                if (isMobileView) {
                    event.preventDefault();
                    list.classList.remove("_j4ddova");
                    list.classList.add('_168jpr66');
                    detail.classList.remove('_114ptpw7');
                    detail.classList.add("_no1oxt4");

                    if (backButton) {
                        backButton.style.display = 'block';
                    }

                    fetch(event.currentTarget.href)
                        .then(response => response.text())
                        .then(html => {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            const newContent = doc.querySelector('#thread_panel').innerHTML;
                            detail.innerHTML = newContent;

                            const newBackButtonContainer = detail.querySelector('.lbzxe2l');
                            if (newBackButtonContainer && backButton) {
                                newBackButtonContainer.appendChild(backButton);
                            }

                        })
                        .catch(error => console.error('Error loading content:', error));
                }
            }

            if (backButton) {
                backButton.removeEventListener('click', handleBackClick);
                backButton.addEventListener('click', handleBackClick);
            }

            function handleBackClick() {
                if (isMobileView) {
                    list.classList.remove('_168jpr66');
                    list.classList.add("_j4ddova");
                    detail.classList.remove('_no1oxt4');
                    detail.classList.add("_114ptpw7");

                    if (backButton) {
                        backButton.style.display = 'none';
                    }
                }
            }
        }
    };

    const setupEventListeners = () => {
        handleResize();
        window.addEventListener('resize', handleResize);
        document.addEventListener('turbo:frame-load', handleResize);
        document.addEventListener('turbo:render', handleResize);
        document.addEventListener('turbo:before-cache', handleResize);
    };

    setupEventListeners();
});
