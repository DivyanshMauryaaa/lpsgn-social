import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='ml-[150%]'>
            <SignIn />
        </div>
    )
}