import * as React from "react";
import { Text, ProgressIndicator, Stack, Icon } from "@fluentui/react";
import { CellRendererOverrides } from "../types";

const formatDateTime = (dateValue: Date): string => {
	const day = String(dateValue.getDate()).padStart(2, "0");
	const month = String(dateValue.getMonth() + 1).padStart(2, "0");
	const year = dateValue.getFullYear();
	const hours = String(dateValue.getHours()).padStart(2, "0");
	const minutes = String(dateValue.getMinutes()).padStart(2, "0");
	const seconds = String(dateValue.getSeconds()).padStart(2, "0");
	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const getProgressColor = (percentage: number): string => {
	if (percentage < 25) return "#d13438"; // Red
	if (percentage < 75) return "#ffaa44"; // Amber
	return "#107c10"; // Green
};

const optionSetColorMap: Record<string, string> = {
	"Queued": "#00ccff",
	"Running": "#ff9966",
	"Suceeded": "#99cc99",
	"Failed": "#ff6666",
	"Skipped": "#ff6666",
	"Cancelled": "#ff6666",
};

export const cellRendererOverrides: CellRendererOverrides = {
	["Text"]: (props, col) => {
		return null;
	},
	["Decimal"]: (props, col) => {
		const columnName = col.colDefs[col.columnIndex].name;
		if (columnName === "cra_percentagecomplete") {
			const value = (props.value as number) ?? 0;
			const percentage = Math.round(value * 100);
			const barColor = getProgressColor(percentage);
			return (
				<Stack verticalAlign="center" styles={{ root: { height: "100%", paddingLeft: 8, paddingRight: 8 } }}>
					<ProgressIndicator
						percentComplete={value}
						styles={{
							progressBar: { backgroundColor: barColor, height: 8, borderRadius: 4 },
							progressTrack: { height: 8, borderRadius: 4 },
						}}
					/>
				</Stack>
			);
		}
		if (columnName === "cra_duration") {
			const value = (props.value as number) ?? 0;
			const wholeSeconds = Math.round(value);
			return (
				<Stack
					horizontal
					verticalAlign="center"
					tokens={{ childrenGap: 8 }}
					styles={{ root: { height: "100%", paddingLeft: 8, paddingRight: 8 } }}
				>
					<Icon iconName="Stopwatch" styles={{ root: { fontSize: 16, color: "#0078d4" } }} />
					<Text>{Math.floor(wholeSeconds/60)}m ({wholeSeconds}s)</Text>
				</Stack>
			);
		}
		return null;
	},
	["OptionSet"]: (props, col) => {
		const optionText = props.formattedValue ?? "";
		const optionColor = optionSetColorMap[optionText] ?? "#ffffff";
		if (col.colDefs[col.columnIndex].name === "cra_researchplanrunstatus") {
			return (
				<Stack verticalAlign="center" horizontalAlign="center" styles={{ root: { height: "100%", padding: 4 } }}>
					<Text
						styles={{
							root: {
								backgroundColor: optionColor,
								padding: "2px 8px",
								textAlign: "center",
								borderRadius: 8,
								width: "100%",
							},
						}}
					>
						{optionText}
					</Text>
				</Stack>
			);
		}
		return null;
	},
	["DateAndTime"]: (props, col) => {
		const dateValue = props.value ? new Date(props.value as string) : null;
		const formattedDate = dateValue ? formatDateTime(dateValue) : "";
		return (
			<Stack
				horizontal
				verticalAlign="center"
				tokens={{ childrenGap: 8 }}
				styles={{ root: { height: "100%", paddingLeft: 8, paddingRight: 8 } }}
			>
				<Icon iconName="Calendar" styles={{ root: { fontSize: 16, color: "#0078d4" } }} />
				<Text>{formattedDate}</Text>
			</Stack>
		);

	},
};