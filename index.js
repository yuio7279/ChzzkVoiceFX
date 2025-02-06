const { ChzzkClient } = require('chzzk');


const options = {
    nidAuth: 'NID_AUT',  // 로그인 후 얻은 쿠키 값
    nidSession: 'NID_SES'
};

const client = new ChzzkClient(options);
const supportedEmojis = ["{:d_1:}", "{:d_2:}", "{:d_3:}"];


async function main() {
    const result = await client.search.channels(''); // 원하는 채널명 입력
    if (result.channels.length === 0) {
        console.log('채널을 찾을 수 없습니다.');
        return;
    }

    const channel = result.channels[0];
    console.log(`채널 ID: ${channel.channelId}, 채널명: ${channel.channelName}`);

    const chzzkChat = client.chat({ channelId: channel.channelId });

    /*chzzkChat.on('chat', chat => {
        // console.log(`${chat.profile.nickname}: ${chat.message}`);
    });*/


    chzzkChat.on('donation', donation => {
        console.log(`>> ${donation.profile?.nickname ?? '익명의 후원자'} 님이 ${donation.extras.payAmount}원 후원`);
        console.log(donation.extras.status);
        let message = donation.message;
        let emojiStr = extractFirstEmoticon(message);
        if(emojiStr != null || emojiStr === ""){
            applyVoiceFilter(emojiStr);
        }
    });

    chzzkChat.connect();
}

main();

function extractFirstEmoticon(message) {
    const emojiPattern = /{\:d_\d+\:}/g; // {:d_숫자:} 형태 찾기
    const matches = message.match(emojiPattern); // 모든 매칭된 이모지 찾기

    if (matches && matches.length > 0) {
        const firstEmoji = matches.find(emoji => supportedEmojis.includes(emoji)); // 지원하는 이모지만 필터링
        return firstEmoji ?? null; // 첫 번째 지원 이모지만 반환
    }
    return null; // 이모지가 없으면 null 반환
}
function applyVoiceFilter(emoji) {
    const filterMap = {
        "{:d_1:}": "filter1",
        "{:d_2:}": "filter2",
        "{:d_3:}": "filter3",
    };

    const filter = filterMap[emoji];
    if (filter) {
        console.log(`🎙️ ${filter} 음성 필터 적용`);
        // 실제 음성 필터 API 호출 로직 추가 가능
    }
}


