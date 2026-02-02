import * as React from "react";
import { Label, ProgressIndicator, Stack } from "@fluentui/react";
import { CellRendererOverrides } from "../types";

const getProgressColor = (percentage: number): string => {
	if (percentage < 25) return "#d13438"; // Red
	if (percentage < 75) return "#ffaa44"; // Amber
	return "#107c10"; // Green
};

const optionSetColorMap: Record<string, string> = {
	"Queued": "#00ccff",
	"Running": "#cc9966",
	"Suceeded": "#99cc99",
	"Failed": "#990000",
	"Skipped": "#990000",
	"Cancelled": "#990000",
};

export const cellRendererOverrides: CellRendererOverrides = {
	["Text"]: (props, col) => {
		return null;
	},
	["Decimal"]: (props, col) => {
		if (col.colDefs[col.columnIndex].name === "cra_percentagecomplete") {
			const value = (props.value as number) ?? 0;
			const percentage = Math.round(value * 100);
			const barColor = getProgressColor(percentage);
			return (
				<Stack verticalAlign="center" styles={{ root: { height: "100%" } }}>
					<ProgressIndicator
						percentComplete={value}
						styles={{
							progressBar: { backgroundColor: barColor, height: 8 },
							progressTrack: { height: 8 },
						}}
					/>
				</Stack>
			);
		}
		return null;
	},
	["OptionSet"]: (props, col) => {
		const optionText = props.formattedValue ?? "";
		const optionColor = optionSetColorMap[optionText] ?? "#ffffff";
		return (
			<Stack verticalAlign="center" horizontalAlign="center" styles={{ root: { height: "100%", padding: 4 } }}>
				<Label
					styles={{
						root: {
							backgroundColor: optionColor,
							padding: 4,
							textAlign: "center",
							width: "100%",
						},
					}}
				>
					{optionText}
				</Label>
			</Stack>
		);
	},
};