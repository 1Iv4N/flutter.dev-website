(function() {
    // Form elements
    const subscribeContainer = document.querySelector('.subscribe-container');
    const subscribeForm = document.querySelector('.subscribe-container__form');
    const errorMessage = document.querySelector('.error-message');
    const successMessage = document.querySelector('.success-message');
    const requiredFields = Array.from(subscribeForm.querySelectorAll("[required]"));
    const formSubmitButton = document.querySelector('.form-submit-button');

    // Add change eventListener to required fields
    requiredFields.forEach(item => item.addEventListener('change', submitButtonHandler));

    // Check request after clicking the submit button
    formSubmitButton.addEventListener('click', () => checkRequest());

    //  Create an XMLHttpRequest to get formbox response
    function checkRequest() {
        const url = 'https://services.google.com/fb/submissions/flutter-updates/';
        const request = new XMLHttpRequest();

        request.onreadystatechange = () => {
            // readyState 4 means that the operation is complete.
            if (request.readyState === 4) {
                if (request.status >= 400) {
                    errorMessage.classList.add('d-block');
                } else if (subscribeForm.reportValidity() === false) {
                    return false;
                } else {
                    const response = request.response ? JSON.parse(request.response).result : null;
                    successHandler(response);
                }
            }
        };

        request.open('post', url);
        if (request) {
            request.send(new FormData(subscribeForm));
        }
    }

    // Show error/success message given the response
    function successHandler(response) {
        const errorMessageClass = errorMessage.classList;

        if (response === 'accepted') {
            subscribeContainer.classList.add('d-none');
            subscribeForm.classList.add('d-none');
            successMessage.classList.add('d-block');

            if (errorMessageClass.contains('d-block')) {
                errorMessageClass.remove('d-block');
                errorMessageClass.add('d-none');
            }
        } else {
            errorMessage.classList.add('d-block');
        }
    }

    // Validation made when required inputs change
    function submitButtonHandler () {
        const requiredFieldsChecked = requiredFields.every(item => item.checkValidity() === true);
        const submitButtonClass = formSubmitButton.classList;

        subscribeForm.reportValidity();

        if (requiredFieldsChecked) {
            submitButtonClass.add('btn-primary');
            submitButtonClass.remove('form-submit-button__disabled');
            formSubmitButton.disabled = false;
        } else if (submitButtonClass.contains('btn-primary')) {
            submitButtonClass.remove('btn-primary');
            submitButtonClass.add('form-submit-button__disabled');
            formSubmitButton.disabled = true;
        }
    }
}());
