import { useForm } from "react-hook-form";
import * as apiClient from "../api-client"
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export type SignInFormData = {
    email: string;
    password: string;
}

const SignIn = () => {
    const queryClient = useQueryClient()
    const {showToast} = useAppContext()
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm<SignInFormData>();
    

    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async() => {
            await queryClient.invalidateQueries("validateToken")
            showToast({ message: "Login successful!", type: "SUCCESS"});
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"})   
        }  
    })
    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data)
    })
    return (
        <form action="" className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>
            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                    Email
                    <input type="email" className="border rounded w-full py-1 px-2 font-normal" {...register("email", {
                        validate: (val) => {
                            if(!val){
                                return "This field is required"
                            }else if(!val.includes("@")){
                                return "Email not correct"
                            }
                        }
                        })} />
                    {errors.email && (
                        <span className="text-red-500">{errors.email.message}</span>
                    )}
            </label>
            <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                    Password
                    <input type="password" className="border rounded w-full py-1 px-2 font-normal" {...register("password", {required: "This field is required", minLength: {
                        value: 6,
                        message: "Password must be atleast 6 characters"
                    }})} />
                    {errors.password && (
                        <span className="text-red-500">{errors.password.message}</span>
                    )}
            </label>
            <span className="flex items-center justify-between">
                <span className="text-sm">
                    Not Registered? <Link className="underline" to="/register">Create an account here</Link>
                </span>
                <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500">
                    Login
                </button>
            </span>
        </form>
    )
}


export default SignIn