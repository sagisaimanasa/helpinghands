const button = document.getElementById("bt")
button.addEventListener("click", () => {
  console.log("Button Clicked")
  fetch("/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: 1 },
        { id: 2, quantity: 1 },
        { id: 3, quantity: 1 }
      ],
    }),
  })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    }).then(({ url }) => {
        //console.log(url);
      window.location = url
    }).catch(e => {
      console.error(e.error)
    })
})