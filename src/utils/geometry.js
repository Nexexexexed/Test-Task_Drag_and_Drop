export function randPolygons(min = 5, max = 15) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  return Array.from({ length: count }, () => {
    const points = Array.from(
      { length: 3 + Math.floor(Math.random() * 5) },
      () => [(Math.random() * 80).toFixed(1), (Math.random() * 80).toFixed(1)]
    );
    return `<polygon points="${points.map((p) => p.join(",")).join(" ")}" />`;
  });
}
