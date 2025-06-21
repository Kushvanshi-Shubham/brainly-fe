interface ButtonProp {
  variant: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text?: string;
  startIcon?: any;
  endIcon?: any;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyle = {
  primary: " bg-purple-500 text-white",
  secondary: " bg-purple-300 text-white",
};

const sizeStyle = {
  sm: "py-1 px-2 text-sm rounded-sm",
  md: "py-2 px-4 text-md rounded-md",
  lg: "py-4 px-8 text-md rounded-lg",
};

const defaultStyle = "rounded flex";

export const Button = (props: ButtonProp) => {
  return (
    <button
      onClick={props.onClick}
      className={`${variantStyle[props.variant]} ${defaultStyle} ${
        sizeStyle[props.size]
      } ${props.fullWidth ? "w-full justify-center" : ""} ${
        props.loading ? "opacity-30" : "cursor-pointer"
      }`}
      disabled={props.loading}
    >
      {props.startIcon ? (
        <div className=" flex items-center pr-1">{props.startIcon}</div>
      ) : null}{" "}
      {props.text} {props.endIcon}{" "}
    </button>
  );
};

<Button variant="primary" size="lg"></Button>;
