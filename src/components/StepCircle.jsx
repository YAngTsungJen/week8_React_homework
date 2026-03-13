const Circle = ({ number, title, active }) => (
  <div className="text-center" style={{ zIndex: 2 }}>
    <div
      className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${active ? 'bg-primary text-white' : 'bg-light text-muted'}`}
      style={{
        width: '64px',
        height: '64px',
        fontSize: '14px',
        border: active ? 'none' : '1px solid #dee2e6',
        fontWeight: 'bold',
        lineHeight: '1.2',
      }}
    >
      <span>
        {number}.<br />
        {title}
      </span>
    </div>
  </div>
);

function StepCircle({ currentStep }) {
  const steps = [
    { number: '1', title: '清單確認' },
    { number: '2', title: '資料填寫' },
    { number: '3', title: '付款確認' },
    { number: '4', title: '完成訂單' },
  ];
  return (
    <div className="row justify-content-center mb-5 mt-4">
      <div className="col-md-8 d-flex justify-content-between align-items-center position-relative">
        <div
          className="position-absolute top-50 start-0 end-0 border-bottom"
          style={{ zIndex: 1, transform: 'translateY(-15px)' }}
        ></div>
        {steps.map((step) => (
          <Circle
            key={step.number}
            number={step.number}
            title={step.title}
            active={currentStep >= parseInt(step.number)}
          />
        ))}
      </div>
    </div>
  );
}

export default StepCircle;
