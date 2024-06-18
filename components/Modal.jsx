export default function Modal({ isOpen, onClose, children }) {
  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className='modal-box'>
        {children}
        <div className='modal-action'>
          <button onClick={onClose} className='btn'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
