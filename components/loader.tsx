import Image from "next/image";

export const Loader = () => {
    return (
        <div className="h-full flex flex-col items-center justify-center gap-y-4">
            <div className="relative w-10 h-10 animate-spin">
                <Image alt="logo" fill src='/load.png' />
            </div>
            <p className="text-muted-foreground text-sm text-center">Mixme is thinking ...</p>
        </div>
    );
}