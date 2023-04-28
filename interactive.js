const DEMO_ORGANIZE_FILES_OFFSET = 0;
const DEMO_MANIPULATE_FILES_OFFSET = 91;
const DEMO_TASKS_FILES_OFFSET = 197.5;

const DEMO_SHOW_RESUME_MARKDOWN_TIME_OFFSET = 104;
const DEMO_SHOW_RESUME_WORD_TIME_OFFSET = 157.5;
const DEMO_SHOW_POTENTIAL_EMPLOYERS_TIME_OFFSET = 202.2;
const DEMO_SHOW_BOUNCED_NORMAL_EMAILS = 260;
const DEMO_SHOW_BOUNCED_SKYNET_EMAIL = 290;
const STATES = {
    MARKDOWN: 1,
    WORD: 2,
    POTENTIAL_EMPLOYERS: 3,
    NORMAL_BOUNCE: 4,
    SCARY_BOUNCE: 5,
};

const DEMO_EARLY_REJECTIONS = [
    'Application for "A bio-informatics company specializing in creating beautiful monsters',
    'Application for "Kinda boring corporate job, but really amazing benefits and great location in New York.',
    'Application for "Gadgets and gizmo’s, would be nice to work with more physical items.',
    'Application for "Using cutting edge AI to solve crimes'
];

const DEMO_SCARY_REJECTIONS =
    'Application for "Cutting edge robotics DO NOT RELEASE AEROME BAD THINGS WILL HAPPEN';

let state = STATES.MARKDOWN;

function playDemo(at = demo.currentTime) {
    demo.currentTime = at;
    demo.parentElement.classList.add('playing');

    showDemo();
    updateDemoTime();

    demo.play();
}

function updateDemoTime() {
    const footerList = document.querySelector('footer ul');

    if (demo.currentTime <= DEMO_MANIPULATE_FILES_OFFSET) {
        footerList.className = 'selected-first';
    } else if (demo.currentTime <= DEMO_TASKS_FILES_OFFSET) {
        footerList.className = 'selected-second';
    } else {
        footerList.className = 'selected-third';
    }

    switch (state) {
        case STATES.MARKDOWN:
            if (Math.abs(DEMO_SHOW_RESUME_MARKDOWN_TIME_OFFSET - demo.currentTime) <= 0.5) {
                state = STATES.WORD;
                showFigure(1, 3, DEMO_SHOW_RESUME_MARKDOWN_TIME_OFFSET);
            }
            break

        case STATES.WORD:
            if (Math.abs(DEMO_SHOW_RESUME_WORD_TIME_OFFSET - demo.currentTime) <= 0.5) {
                state = STATES.POTENTIAL_EMPLOYERS;
                showFigure(2, 4, DEMO_SHOW_RESUME_WORD_TIME_OFFSET);
            }
            break;

        case STATES.POTENTIAL_EMPLOYERS:
            if (Math.abs(DEMO_SHOW_POTENTIAL_EMPLOYERS_TIME_OFFSET - demo.currentTime) <= 0.5) {
                state = STATES.NORMAL_BOUNCE;
                showFigure(3, 3, DEMO_SHOW_POTENTIAL_EMPLOYERS_TIME_OFFSET);
            }
            break;

        case STATES.NORMAL_BOUNCE:
            if (Math.abs(DEMO_SHOW_BOUNCED_NORMAL_EMAILS - demo.currentTime) <= 0.5) {
                state = STATES.SCARY_BOUNCE;
                showBunchedMockNotifications(DEMO_EARLY_REJECTIONS);
            }
            break;

        case STATES.SCARY_BOUNCE:
            if (Math.abs(DEMO_SHOW_BOUNCED_SKYNET_EMAIL - demo.currentTime) <= 0.5) {
                state = STATES.MARKDOWN;
                showMockNotification(DEMO_SCARY_REJECTIONS)
            }
            break;
    }
}

function pauseDemo() {
    demo.parentElement.classList.remove('playing');
    demo.pause();
}

function showFigure(at, showDemoDelay, timeAfterShowFigure) {
    document.querySelector(`main div figure:nth-child(${at})`).style.width = '80%';
    document.querySelector(`.video-container`).style.width = '0';

    demo.pause();
    setTimeout(playDemo.bind(null, timeAfterShowFigure), showDemoDelay * 1000);
}

function showDemo() {
    for (const figure of document.querySelectorAll(`main div figure`)) {
        figure.style.width = '0';
    }
    document.querySelector(`.video-container`).style.width = '90%';
}

function showBunchedMockNotifications(notifications) {
    notifications.forEach((n, i) => {
        setTimeout(() => {
            showMockNotification(n, i);
        }, i * 270);
    });
}

function showMockNotification(text, zIndex) {
    for (const existing of document.querySelectorAll('main > div .notification')) {
        existing.dataset.cancelled = true;
    }

    const notification = document.createElement('div');
    if (zIndex) {
      notification.style.zIndex = zIndex;
    }
    notification.classList.add('notification');
    notification.innerHTML =
        '<img src="assets/images/m.png" /><span class="title"></span><span class="body"></span>';

    notification.querySelector('.title').textContent = 'Mail Delivery System';
    notification.querySelector('.body').textContent = text;
    notification.animate([
        { opacity: 0, transform: 'translateY(-70px)' },
        { opacity: 1, transform: 'translateY(10px)' }
    ], {
        duration: 200,
        fill: 'forwards',
        easing: 'ease-in'
    }).finished.then(() => {
        return new Promise(r => setTimeout(r, 1500));
    }).then(() => {
        if (!notification.dataset.cancelled) {
            notification.animate([
                { opacity: 1, transform: 'translateY(10px)' },
                { opacity: 0, transform: 'translateY(80px)' }
            ], {
                duration: 250,
                fill: 'forwards',
                easing: 'ease-out'
            }).finished.then(() => {
                notification.remove();
            });
        } else {
            notification.remove();
        }
    });

    document.querySelector('main > div').append(notification);
}

demo.addEventListener('timeupdate', updateDemoTime);

demo.addEventListener('ended', e => {
    demo.currentTime = 0;
    updateDemoTime();
});

document.querySelector('footer').addEventListener('click', e => {
    const li = e.target.closest('li');
    if (li) {
        switch (li.querySelector('h3').textContent) {
            case 'Organize Files': {
                playDemo(DEMO_ORGANIZE_FILES_OFFSET);
                break;
            }
            case 'Manipulate Files': {
                playDemo(DEMO_MANIPULATE_FILES_OFFSET);
                break;
            }

            case 'Complex Tasks': {
                state = STATES.POTENTIAL_EMPLOYERS;
                playDemo(DEMO_TASKS_FILES_OFFSET);
                break;
            }
        }
    }
});

showDemo();
