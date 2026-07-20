function imageSources(source) {
  const match = source.match(/^(.*)-1024(\.[a-z0-9]+)$/i);
  if (!match) return { src: source, srcset: "" };
  const [, base, extension] = match;
  return {
    src: source,
    srcset: `${base}-640${extension} 640w, ${base}-1024${extension} 1024w, ${base}-1600${extension} 1600w`,
  };
}

export function setResponsiveBanner(image, source, alt) {
  const sources = imageSources(source);
  image.src = sources.src;
  image.srcset = sources.srcset;
  image.sizes = "100vw";
  image.alt = alt;
}

export function preloadResponsiveBanner(source) {
  const sources = imageSources(source);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = sources.src;
    image.srcset = sources.srcset;
    image.sizes = "100vw";
    image.onload = resolve;
    image.onerror = reject;
  });
}
