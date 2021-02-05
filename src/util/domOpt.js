module.exports = {
    $(id) {
        return document.getElementById(id);
    },
    $radioValue(radiosName) {
        const radios = document.getElementsByName(radiosName);
        const radio = Array.prototype.find.call(radios, radio => {
            console.log(radio);
            return radio.checked === true;
        })
        return radio.value;
    },
}