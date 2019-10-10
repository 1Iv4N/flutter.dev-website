
// Form elements
const subscribeForm = document.querySelector('.subscribe-container__form');
const errorMessage = document.querySelector('.error-message');
const successMessage = document.querySelector('.success-message');
const requiredFields = Array.from(subscribeForm.querySelectorAll("[required]"));
const heading = document.querySelector('.heading');
const subheading = document.querySelector('.subheading');
const formSubmitButton = document.querySelector('.form-submit-button');
// Ajax elements
const url = 'https://services.google.com/fb/submissions/flutter-updates/';
const request = new XMLHttpRequest();
let response = null;

// Add change eventListener to required fields
requiredFields.forEach(item => item.addEventListener('change', submitButtonHandler));

// Validation before submit
formSubmitButton.addEventListener('click', () => {
    const checkFormValidity = requiredFields.every(item => {
        if (!item.reportValidity()) {
            item.classList.add('invalid-field');
        }
        return item.reportValidity() === true;
    });

    request.onreadystatechange = () => {
        // readyState 4 means that the operation is complete.
        if (request.readyState === 4) {
            if (request.status >= 400) {
                errorMessage.classList.add('d-block');
            } else if (checkFormValidity === false) {
                return false;
            } else {
                response = request.response ? JSON.parse(request.response).result : null;
                successHandler();
            }
        }
    };

    request.open('post', url);
    request.send(new FormData(subscribeForm));
});

//
function successHandler() {
    if (response === 'accepted') {
        const errorMessageClass = errorMessage.classList;
        heading.classList.add('d-none');
        subheading.classList.add('d-none');
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

// Validation when required inputs change
function submitButtonHandler () {
    const requiredFieldsChecked = requiredFields.every(item => item.checkValidity() === true);
    const submitButtonClass = formSubmitButton.classList;

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
