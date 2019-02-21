let teamSelectLayer = null;

window.addEventListener('load', () => {
  teamSelectLayer = document.querySelector('.team-select-layer');
});

function showTeamSelect() {
  teamSelectLayer.style.display = 'flex';
}

function hideTeamSelect() {
  teamSelectLayer.style.display = 'none';
}

function selectTeam(teamId) {
  alt.emit('teamSelected', teamId);
  hideTeamSelect();
}
