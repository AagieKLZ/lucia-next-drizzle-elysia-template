import type React from "react";

type Props = {
	children: React.ReactNode;
};

export default function LoginLayout({ children }: Props) {
	return (
		<div className="w-full flex justify-center items-center h-screen">
			{children}
			<div className="flex-1 h-screen bg-slate-600 lg:block hidden" />
		</div>
	);
}
