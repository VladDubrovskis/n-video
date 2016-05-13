om /*global videojs*/
const Video = require('./video');

let playerInstanceId = 0;

const ACCOUNT_ID = '2221711291001';
const PLAYER_ID = 'HJ0CnzzM';

const eventListener = (video, ev) => {
	const event = document.createEvent('Event');
	event.initEvent('beacon:media', true, true);
	event.detail = {
		mediaType: 'video',
		contentId: video.id,
		domPath: video.domPath,
		domPathTokens: video.domPathTokens,
		event: ev.type
	};
	document.body.dispatchEvent(event);
}

let brightcoveLibraryLoadPromise;

const ensureBrightcoveLibraryLoaded = () => {
	if (brightcoveLibraryLoadPromise) {
		return brightcoveLibraryLoadPromise;
	}
	const script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', `//players.brightcove.net/${ACCOUNT_ID}/${PLAYER_ID}_default/index.min.js`);
	script.setAttribute('async', true);
	script.setAttribute('defer', true);
	document.getElementsByTagName("head")[0].appendChild(script);
	brightcoveLibraryLoadPromise = new Promise(resolve => {
		script.addEventListener('load', () => {
			resolve();
		});
	});
	return brightcoveLibraryLoadPromise;
}

class BrightcovePlayer extends Video {
	constructor(el, opts) {
		super(el, opts);
		playerInstanceId++;
		this.instanceId = playerInstanceId;
	}

	init () {
		const videoId = this.containerEl.getAttribute('data-n-video-id');
		const brightcovePlayerInstance = this;
		this.containerEl.innerHTML = `<div class="n-video__brightcove-player"><video
				id="brightcove-player-${this.instanceId}"
				data-account="${ACCOUNT_ID}"
				data-player="${PLAYER_ID}"
				data-embed="default"
				data-video-id="${videoId}"
				class="video-js"
				controls></video></div>`;
		return ensureBrightcoveLibraryLoaded()
			.then(() => {
				let advertPlayer = videojs(`brightcove-player-${brightcovePlayerInstance.instanceId}`)
        advertPlayer.one('loadedmetadata', function(){
					// Setup:
					// Go to https://studio.brightcove.com/products/videocloud/players
					// Add new player
					// In player configuration go to plugins and add IMA plugin URLs
					// http://players.brightcove.net/videojs-ima3/2/videojs.ima3.min.js
					// http://players.brightcove.net/videojs-ima3/2/videojs.ima3.min.css

					// You can then use API to set advert URL
					// More information can be found here:
					// http://docs.brightcove.com/en/perform/brightcove-player/guides/ima-plugin.html

					// PLayer version 5.2.2
					// URLs that give back ads:
					// DFP: https://pubads.g.doubleclick.net/gampad/ads?adk=3807807256&ciu_szs=728x90%7C468x60%7C970x90%7C970x66%7C970x250%2C270x42%2C300x250%7C300x600%7C336x850%7C336x280%7C300x1050&correlator=3822920880343633&cust_params=frmt%3D0%26frmt%3D1%26frmt%3D22%26plID%3D2228337108001%2607%3DPR%26ksg%3Dpev5eiptx%2Cny5ybwsu7%2Cp15ks66hk%2Co2kglewly%2Cp4z4jxs2m%2Cph2ccc7dy%2Cpkxe4ko47%2Cqin9m1fj6%2Coaerxnp7z%2Cn57vzffub%2Cqg9djcbwt%2Cnxeezxueh%2Cnxbhzvd4t%2Cqbueuzvb4%2Cn6snrnrph%2Cql61j3yvt%2Cn54qvtx2w%2Cn8zefhz4q%2Cpmg95def8%2Co9dvtjk9e%2Cqicwytlji%2Cpccjkvz9h%2Cpkdsrvltm%2Cptjmmxd0h%2Cnswb9d6y0%2Co2kgnprbd%2Cp4gp4zt5d%2Cn9ri5q1dz%2Cqaf7kzaje%2Cpx91klibh%2Cqe5vhdcth%2Cqdppayg8k%2Cqdppes5u9%2Cqhhcfq24w%2Cqojdp4ors%2Coaiw8eizb%2Cqi4uil3z5%2Copaql9itp%2Cqh5vm1eda%2Cnzunm81hz%2Cqmvnu7l69%2Cp2xegvb2q%2Cqdppcudff%2Cokst1c270%2Cqbqwf90q0%2Cpzhms3aqn%2Codotm5z05%2Cqin9k0w8j%2Cpt6r2z2g4%2Cnxehjr8dn%2Cozzt7grw8%2Cp28rlq9rm%2Cnvvw5hg7d%2Cn4dfymd9j%2Cpzh0cglak%2Comu0yjuty%2Cqb2wl4uk5%2Cobmiv319e%2Cqbudd1065%2Cnosy5aemo%2Cpti2w7agp%2Cpubk9osjr%2Cnwuo3s9g5%2Cqnfwmb2v8%2Cp6kssyez3%26kuid%3Dqcq2eiwow%26khost%3Dvideo.ft.com%2606%3DITC%26slv%3Dlv2%26eid%3D12535197%2605%3DMAP%2614%3DGBR%26brand%3Dft%20business%26section%3Dcompanies%26lnID%3D69928161001%26ttID%3D4887147983001%26cue%3Dpre%26cgm%3D0&description_url=http%3A%2F%2Fvideo.ft.com%2F4887147983001%2FAmazon-v-YouTube%2Fcompanies&dt=1463062614891&env=vp&flash=21.0.0.216&frm=0&gdfp_req=1&ged=ve4_pt4.2.5_td4_tt1_pd1_bs10_la1000_er237.146.637.860_vi1.0.531.1265_vp74_eb23147&impl=s&iu=%2F5887%2Fftcom.5887.video%2Fvideo-hub&mpt=brightcove%2Fsmartplay&mpv=us20151216.1310&osd=6&output=xml_vast2&scor=4075485588515631&scp=pos%3Dvideo&sdkv=3.233.0&sdr=1&sz=592x333%7C400x225&u_ah=1057&u_asa=1&u_aw=1920&u_cd=24&u_h=1080&u_his=10&u_java=false&u_nmime=7&u_nplug=5&u_tz=60&u_w=1920&unviewed_position_start=1&url=http%3A%2F%2Fvideo.ft.com%2F4887147983001%2FAmazon-v-YouTube%2Fcompanies&vid=4887147983001
					// Brightcove: http://solutions.brightcove.com/bcls/brightcove-player/vmap/simple-vmap.xml

          advertPlayer.ima3({
              "adTechOrder": ['html5', 'flash'],
              "serverUrl": 'https://pubads.g.doubleclick.net/gampad/ads?adk=3807807256&ciu_szs=728x90%7C468x60%7C970x90%7C970x66%7C970x250%2C270x42%2C300x250%7C300x600%7C336x850%7C336x280%7C300x1050&correlator=3822920880343633&cust_params=frmt%3D0%26frmt%3D1%26frmt%3D22%26plID%3D2228337108001%2607%3DPR%26ksg%3Dpev5eiptx%2Cny5ybwsu7%2Cp15ks66hk%2Co2kglewly%2Cp4z4jxs2m%2Cph2ccc7dy%2Cpkxe4ko47%2Cqin9m1fj6%2Coaerxnp7z%2Cn57vzffub%2Cqg9djcbwt%2Cnxeezxueh%2Cnxbhzvd4t%2Cqbueuzvb4%2Cn6snrnrph%2Cql61j3yvt%2Cn54qvtx2w%2Cn8zefhz4q%2Cpmg95def8%2Co9dvtjk9e%2Cqicwytlji%2Cpccjkvz9h%2Cpkdsrvltm%2Cptjmmxd0h%2Cnswb9d6y0%2Co2kgnprbd%2Cp4gp4zt5d%2Cn9ri5q1dz%2Cqaf7kzaje%2Cpx91klibh%2Cqe5vhdcth%2Cqdppayg8k%2Cqdppes5u9%2Cqhhcfq24w%2Cqojdp4ors%2Coaiw8eizb%2Cqi4uil3z5%2Copaql9itp%2Cqh5vm1eda%2Cnzunm81hz%2Cqmvnu7l69%2Cp2xegvb2q%2Cqdppcudff%2Cokst1c270%2Cqbqwf90q0%2Cpzhms3aqn%2Codotm5z05%2Cqin9k0w8j%2Cpt6r2z2g4%2Cnxehjr8dn%2Cozzt7grw8%2Cp28rlq9rm%2Cnvvw5hg7d%2Cn4dfymd9j%2Cpzh0cglak%2Comu0yjuty%2Cqb2wl4uk5%2Cobmiv319e%2Cqbudd1065%2Cnosy5aemo%2Cpti2w7agp%2Cpubk9osjr%2Cnwuo3s9g5%2Cqnfwmb2v8%2Cp6kssyez3%26kuid%3Dqcq2eiwow%26khost%3Dvideo.ft.com%2606%3DITC%26slv%3Dlv2%26eid%3D12535197%2605%3DMAP%2614%3DGBR%26brand%3Dft%20business%26section%3Dcompanies%26lnID%3D69928161001%26ttID%3D4887147983001%26cue%3Dpre%26cgm%3D0&description_url=http%3A%2F%2Fvideo.ft.com%2F4887147983001%2FAmazon-v-YouTube%2Fcompanies&dt=1463062614891&env=vp&flash=21.0.0.216&frm=0&gdfp_req=1&ged=ve4_pt4.2.5_td4_tt1_pd1_bs10_la1000_er237.146.637.860_vi1.0.531.1265_vp74_eb23147&impl=s&iu=%2F5887%2Fftcom.5887.video%2Fvideo-hub&mpt=brightcove%2Fsmartplay&mpv=us20151216.1310&osd=6&output=xml_vast2&scor=4075485588515631&scp=pos%3Dvideo&sdkv=3.233.0&sdr=1&sz=592x333%7C400x225&u_ah=1057&u_asa=1&u_aw=1920&u_cd=24&u_h=1080&u_his=10&u_java=false&u_nmime=7&u_nplug=5&u_tz=60&u_w=1920&unviewed_position_start=1&url=http%3A%2F%2Fvideo.ft.com%2F4887147983001%2FAmazon-v-YouTube%2Fcompanies&vid=4887147983001'
            });
        });
			});




	}
}

module.exports = BrightcovePlayer;
