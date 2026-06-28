type PrototypeWatermarkProps = {
  label?: string;
};

export default function PrototypeWatermark({ label = "PROTOTYPE" }: PrototypeWatermarkProps) {
  return (
    <div className="fc-prototype-watermark" aria-hidden="true">
      {label}
    </div>
  );
}
