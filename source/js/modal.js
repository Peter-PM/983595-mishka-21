const modalOnList = document.querySelectorAll(".modal--on")
const modal = document.querySelector(".modal");
const modalOff = document.querySelector(".modal-form__button");

for (let modalOn of modalOnList) {
  modalOn.onclick = function () {
    modal.classList.remove("modal--off");
  }
};

modalOff.onclick = function () {
  modal.classList.add("modal--off");
}
