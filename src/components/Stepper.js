
function Stepper({ data }) {
  return (
    <div className="checkout-steps my-6">
      {data.map((item, index) => (
        <div
          className={`checkout-item  ${item.done ? 'checkout-done' : 'checkout-undone'}`}
          key={index}
        >
          <div>{item.step}.{item.content}</div>
        </div>
      ))}
    </div>
  );
}
export default Stepper;
