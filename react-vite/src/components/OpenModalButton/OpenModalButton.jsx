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
    console.log('11111111', bg)
    if (bg) {
      setBackground(false)
    } else {
      setBackground(true)
    }
  };

  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;
