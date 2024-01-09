import { useModal } from '../../context/Modal';

function OpenModalButton({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  bg
}) {
  const { setModalContent, setOnModalClose, setBackground } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
    if (bg) {
      setBackground(false)
    } else {
      setBackground(true)
    }
  };

  return <button onClick={onClick}>{buttonText}</button>;
}

export function OpenModalDiv({
  modalComponent, // component to render inside the modal
  buttonText, // text of the button that opens the modal
  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
  bg
}) {
  const { setModalContent, setOnModalClose, setBackground } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onButtonClick === "function") onButtonClick();
    if (bg) {
      setBackground(false)
    } else {
      setBackground(true)
    }
  };

  return <div onClick={onClick}>{buttonText}</div>;
}


export default OpenModalButton;
