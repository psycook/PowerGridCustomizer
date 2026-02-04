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

const statusConfig: Record<string, { background: string; border: string; text: string; icon: string }> = {
	"Queued": {
		background: "#e6f7ff",
		border: "#91d5ff",
		text: "#0958d9",
		icon: "Clock",
	},
	"Running": {
		background: "#fff7e6",
		border: "#ffd591",
		text: "#d46b08",
		icon: "Sync",
	},
	"Suceeded": {
		background: "#f6ffed",
		border: "#b7eb8f",
		text: "#389e0d",
		icon: "Completed",
	},
	"Failed": {
		background: "#fff2f0",
		border: "#ffccc7",
		text: "#cf1322",
		icon: "ErrorBadge",
	},
	"Skipped": {
		background: "#f5f5f5",
		border: "#d9d9d9",
		text: "#595959",
		icon: "Forward",
	},
	"Cancelled": {
		background: "#f5f5f5",
		border: "#d9d9d9",
		text: "#595959",
		icon: "Blocked",
	},
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
		const config = statusConfig[optionText] ?? {
			background: "#f5f5f5",
			border: "#d9d9d9",
			text: "#595959",
			icon: "StatusCircleQuestionMark",
		};
		if (col.colDefs[col.columnIndex].name === "cra_researchplanrunstatus") {
			return (
				<Stack verticalAlign="center" horizontalAlign="start" styles={{ root: { height: "100%", padding: 4 } }}>
					<Stack
						horizontal
						verticalAlign="center"
						horizontalAlign="center"
						tokens={{ childrenGap: 6 }}
						styles={{
							root: {
								backgroundColor: config.background,
								border: `1px solid ${config.border}`,
								padding: "4px 12px",
								borderRadius: 16,
								boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)",
							},
						}}
					>
						<Icon
							iconName={config.icon}
							styles={{
								root: {
									fontSize: 14,
									color: config.text,
									animation: optionText === "Running" ? "spin 1.5s linear infinite" : undefined,
								},
							}}
						/>
						<Text
							styles={{
								root: {
									color: config.text,
									fontWeight: 500,
									fontSize: 13,
								},
							}}
						>
							{optionText}
						</Text>
					</Stack>
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