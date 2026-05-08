
    setTimeout(() => {

        const messages = document.querySelector('.messages-container');

        if(messages){
            messages.style.opacity = '0';

            setTimeout(() => {
                messages.style.display = 'none';
            }, 500);
        }

    }, 3000);
