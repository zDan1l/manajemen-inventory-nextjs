interface FormIputProps {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    step?: string;
}

export function FormInput()