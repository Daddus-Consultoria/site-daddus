const url = window ? window.location.href : "";

export const avatarNetworks = [
  {
    src: "/images/network/facebook_logo.svg",
    fallback: "F",
    path: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
  },
  {
    src: "/images/network/x_logo.jpg",
    fallback: "X",
    path: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
  {
    src: "/images/network/whatsapp_logo.jpeg",
    fallback: "W",
    path: `whatsapp://send?text=${encodeURIComponent(url)}`,
  },
  {
    src: "/images/network/linkedin_logo.jpeg",
    fallback: "L",
    path: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
      url
    )}`,
  },
];
