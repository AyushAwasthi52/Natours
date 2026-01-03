const logout = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/logout",
    });

    if (res.data.status === "success") {
      location.reload(true);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

document.querySelector(".nav__el--logout").addEventListener("click", logout);
