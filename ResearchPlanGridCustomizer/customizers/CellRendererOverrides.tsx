import * as React from "react";
import { Text, Stack, Icon } from "@fluentui/react";
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

const getProgressStyle = (percentage: number): { color: string; background: string; trackColor: string; icon: string } => {
	if (percentage < 25) return { 
		color: "#dc2626", 
		background: "#fee2e2", 
		trackColor: "#fecaca",
		icon: "CircleRing"
	};
	if (percentage < 100) return { 
		color: "#d97706", 
		background: "#fef3c7", 
		trackColor: "#fde68a",
		icon: "CircleHalfFull"
	};
	return { 
		color: "#16a34a", 
		background: "#dcfce7", 
		trackColor: "#bbf7d0",
		icon: "CompletedSolid"
	};
};

const statusConfig: Record<string, { background: string; text: string; icon: string }> = {
	"Queued": {
		background: "#dbeafe",
		text: "#2563eb",
		icon: "Clock",
	},
	"Running": {
		background: "#fef3c7",
		text: "#d97706",
		icon: "Sync",
	},
	"Suceeded": {
		background: "#dcfce7",
		text: "#16a34a",
		icon: "Completed",
	},
	"Failed": {
		background: "#fee2e2",
		text: "#dc2626",
		icon: "ErrorBadge",
	},
	"Skipped": {
		background: "#f3f4f6",
		text: "#6b7280",
		icon: "Forward",
	},
	"Cancelled": {
		background: "#f3f4f6",
		text: "#6b7280",
		icon: "Blocked",
	},
};

export const cellRendererOverrides: CellRendererOverrides = {
	["Text"]: (props, col) => {
		const columnName = col.colDefs[col.columnIndex].name;
		// Handle Progress column (cra_progress) - displays as "[1/1]"
		if (columnName === "cra_progress") {
			const textValue = (props.value as string) ?? "";
			// Parse the progress text (e.g., "[2/2]")
			const countMatch = textValue.match(/\[(\d+)\/(\d+)\]/);
			const completed = countMatch ? parseInt(countMatch[1], 10) : 0;
			const total = countMatch ? parseInt(countMatch[2], 10) : 1;
			const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
			const style = getProgressStyle(percentage);

			return (
				<Stack
					horizontal
					verticalAlign="center"
					tokens={{ childrenGap: 6 }}
					styles={{
						root: {
							height: "100%",
							paddingLeft: 8,
						},
					}}
				>
					<Icon
						iconName={style.icon}
						styles={{
							root: {
								fontSize: 14,
								color: style.color,
							},
						}}
					/>
					<Text
						styles={{
							root: {
								color: style.color,
								fontWeight: 500,
								fontSize: 13,
							},
						}}
					>
						{textValue}
					</Text>
				</Stack>
			);
		}
		return null;
	},
	["Decimal"]: (props, col) => {
		const columnName = col.colDefs[col.columnIndex].name;
		if (columnName === "cra_percentagecomplete") {
			const value = (props.value as number) ?? 0;
			const percentage = Math.round(value * 100);
			const style = getProgressStyle(percentage);
			return (
				<Stack
					verticalAlign="center"
					styles={{
						root: {
							height: "100%",
							paddingLeft: 8,
							paddingRight: 12,
						},
					}}
				>
					<Stack
						styles={{
							root: {
								position: "relative",
								height: 10,
								backgroundColor: style.trackColor,
								borderRadius: 5,
								overflow: "hidden",
								border: `1px solid ${style.color}30`,
							},
						}}
					>
						<Stack
							styles={{
								root: {
									position: "absolute",
									top: 0,
									left: 0,
									height: "100%",
									width: `${percentage}%`,
									background: `linear-gradient(90deg, ${style.color}cc, ${style.color})`,
									borderRadius: 5,
									transition: "width 0.3s ease",
								},
							}}
						/>
						{/* Shine effect */}
						<Stack
							styles={{
								root: {
									position: "absolute",
									top: 0,
									left: 0,
									height: "50%",
									width: `${percentage}%`,
									background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
									borderRadius: "5px 5px 0 0",
								},
							}}
						/>
					</Stack>
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
			background: "#f3f4f6",
			text: "#4b5563",
			icon: "StatusCircleQuestionMark",
		};
		if (col.colDefs[col.columnIndex].name === "cra_researchplanrunstatus") {
			return (
				<Stack verticalAlign="center" horizontalAlign="start" styles={{ root: { height: "100%", paddingLeft: 8 } }}>
					<Stack
						horizontal
						verticalAlign="center"
						tokens={{ childrenGap: 6 }}
						styles={{
							root: {
								backgroundColor: config.background,
								padding: "4px 10px",
								borderRadius: 4,
							},
						}}
					>
						<Icon
							iconName={config.icon}
							styles={{
								root: {
									fontSize: 14,
									color: config.text,
									animation: optionText === "Running" ? "spin 2s linear infinite" : undefined,
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
