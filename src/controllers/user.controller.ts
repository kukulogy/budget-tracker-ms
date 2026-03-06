export const login = async (req, res) => {
  try {
    res.send("Hello");
  } catch (err) {
    res.status(500).err(err);
  }
}