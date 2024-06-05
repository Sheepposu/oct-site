export default function Backdrop(show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>>) {
    function onClick() {
        if (show) {
            setShow(false);
        }
    }
    
    return (
        <div className={"popup-background" + (show ? " show" : "")} onClick={onClick}></div>
    );
}