import React from "react";

type Props = { text: string };

export default function TextSeparator({ text }: Props) {
	return (
		<div className="w-full flex justify-center h-6 items-start">
			<div className="w-5/12 h-1/2 border-b" />
			<div className="w-2/12 h-full flex justify-center items-center text-slate-400 text-sm">
				{text}
			</div>
			<div className="w-5/12 h-1/2 border-b" />
		</div>
	);
}
