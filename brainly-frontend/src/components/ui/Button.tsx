
interface ButtonProps {
    varient: "primary" | "secondary";
    size: "sm"|"md"|"lg";
    text: String;
    startIcon?: any;
    endIcon?: any;
    onClick ?: ()=> void;
    fullWidth ?: boolean;
}

const Varient = {
    primary: "bg-purple-300 text-purple-500",
    secondary: "bg-purple-500 text-white"
}

const Variablesize = {
    sm: "px-4 py-1",
    md: "px-5 py-2.5",
    lg: "px-8 py-4"
}

const defaultStyle = "rounded-lg font-weight-250 flex items-center cursor-pointer "


export const Button = (props: ButtonProps) => {
    return(
        <button onClick={props.onClick} className={`${Varient[props.varient]} ${Variablesize[props.size]} ${defaultStyle} ${props.fullWidth ? "w-full flex justify-center":""}`} > 
        {props.startIcon ? <div className= "pr-2" >{props.startIcon}</div> : null } {props.text}
        </button>
    )
}