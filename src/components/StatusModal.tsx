import './StatusModal.css'

const ASSETS = '/event-wc'

type StatusModalProps = {
  type: 'success' | 'error'
  message: string
  onClose: () => void
}

function parseRewardAmount(message: string) {
  const match = message.match(/(\d[\d.,]*)/)
  return match?.[1] ?? '888'
}

function StatusModal({ type, message, onClose }: StatusModalProps) {
  const renderMessage = () => {
    if (type === 'success') {
      const amount = parseRewardAmount(message)

      return (
        <div className="status-modal__success">
          <p className="status-modal__success-line1">
            <span className="status-modal__success-heading">CHÚC MỪNG</span>{' '}
            <span className="status-modal__success-sub">bạn đã nhận được</span>
          </p>
          <p className="status-modal__success-reward">{amount}K TIỀN THƯỞNG</p>
        </div>
      )
    }

    return <p className="status-modal__message">{message}</p>
  }

  return (
    <div className="status-modal-overlay">
      <div className="status-modal-wrap">
        <div className="status-modal">
          <img
            src={`${ASSETS}/bg-popup-wc.png`}
            alt=""
            className="status-modal__bg"
            aria-hidden
          />
          <div className="status-modal__content">
            <img
              src={type === 'success' ? `${ASSETS}/icon-done.png` : `${ASSETS}/icon-alert.png`}
              alt={type === 'success' ? 'Thành công' : 'Lỗi'}
              className="status-modal__icon"
            />
            {renderMessage()}
            <button type="button" onClick={onClose} className="status-modal__btn">
              <img
                src={`${ASSETS}/btn-accept.png`}
                alt="Xác nhận"
                className="status-modal__btn-img"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatusModal
