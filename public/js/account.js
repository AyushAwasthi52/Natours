const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/update-password"
        : "/api/v1/users/update-me";

    const res = await axios.patch(url, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    if (res.data.status === "success") {
      alert("Updated successfully!");
    }
  } catch (err) {
    alert(err.response?.data?.message || "Something went wrong");
  }
};

const userDataForm = document.querySelector(".form-user-data");

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();

    updateSettings(
      {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
      },
      "data"
    );
  });
}

const userPasswordForm = document.querySelector(".form-user-password");

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    updateSettings(
      {
        passwordCurrent: document.getElementById("password-current").value,
        password: document.getElementById("password").value,
        passwordConfirm: document.getElementById("password-confirm").value,
      },
      "password"
    );

    userPasswordForm.reset();
  });
}
