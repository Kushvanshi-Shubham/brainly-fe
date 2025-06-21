interface InputProps {
  placeholder: string;
  reference?: any;
  type?: string;
}

export function Input(props: InputProps) {
  return (
    <div>
      <input
        placeholder={props.placeholder}
        type={props.type || "text"}
        className="px-4 py-2 border rounded w-full m-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
        ref={props.reference}
      />
    </div>
  );
}
