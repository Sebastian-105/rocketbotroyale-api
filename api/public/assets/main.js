function getUserData(type) {
  let user_id = document.getElementById('userID').value;
  if (type == 'simple') {
    window.open(`/v2/account/getSimpleProfile?id=${user_id}`);
  } else if (type == 'full') {
    window.open(`/v2/account/getProfile?id=${user_id}`)
  }
}
