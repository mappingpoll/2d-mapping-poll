export default function(data) {
 return Object.keys(data[0]).filter((q) => q != "poll" && q != "Language");
}