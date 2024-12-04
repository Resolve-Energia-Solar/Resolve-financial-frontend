const colors = [
    "#77DD77", // Verde Suave
    "#BFD8B8", // Verde Claro
    "#FDFD96", // Amarelo Suave
    "#FFD1BA", // Pêssego Claro
    "#FFB3AB", // Salmão Suave
    "#FF6961",  // Vermelho Suave
    "#FF0000"  // Vermelho Suave
];

function calculateProgress(startDate, endDate, currentDate) {
    const totalTime = endDate - startDate;
    const elapsedTime = currentDate - startDate;
    let progress = (elapsedTime / totalTime) * 100;
    progress = Math.max(0, Math.min(100, progress));
    return progress;
}

function mapProgressToColor(progress, colorArray) {
    const numberOfColors = colorArray.length;
    const step = 100 / (numberOfColors - 1);
    const colorIndex = Math.min(
        Math.floor(progress / step),
        colorArray.length - 1
    );
    return colorArray[colorIndex];
}


function thermometer(start, end, completed) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const currentDate = new Date(completed) && new Date();

    const progress = calculateProgress(startDate, endDate, currentDate);
    const color = mapProgressToColor(progress, colors);

    return color

}

export default thermometer 