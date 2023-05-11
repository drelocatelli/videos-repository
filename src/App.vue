<script setup lang="ts">
import { ref, watch } from 'vue';

interface IDirectory {
    name: string;
    type: 'directory' | 'file';
    content?: any;
}

const fit = ref<any>('contain');
const dirname = ref('');
const items = ref<IDirectory[]>([]);

watch(() => items.value, (_) => {
	setTimeout(() => {
		const checkboxEl = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
		checkboxEl.checked = true;
		setVideo(0);
	}, 200);
});

function changeVideo(e: Event, index: number) {
	const target = e.target as HTMLInputElement;
	if(target.checked)
		setVideo(index);
}

function setVideo(index: number) {
	const videoEl = document.querySelector('video') as HTMLVideoElement | null;
	setTimeout(() => {
		if(videoEl)
			videoEl.src = URL.createObjectURL(items.value[index].content);
	}, 1000);
}

function setFit() {
    fit.value = fit.value == 'contain' ? 'cover' : 'contain';
}

async function fileHandler() {
    try {
        const dirHandle = await (window as any).showDirectoryPicker();
        items.value = [];
        dirname.value = dirHandle.name;
        for await (const entry of dirHandle.values()) {
			let item = { name: entry.name, type: entry.kind };
            if(entry.kind == 'file') {
				const file = await entry.getFile();
				if(file.type.startsWith('video')) {
					items.value.push({...item, content: file});
				} else {
					items.value.push(item);
				}
			} else {
				// ....
			}
        }
    } catch (err) {
        console.log('directory canceled', err);
    }
}
</script>

<template>
    <div class="buttons">
        <button :onclick="fileHandler">Select folder</button>
        <button v-if="items.length > 0" @click="setFit">Fit: {{ fit }}</button>
    </div>
    <div class="player" v-show="items.length > 0">
        <div class="videoplayer">
            <h2>{{ dirname }}</h2>
            <div class="video-wrapper">
                <video
                    src="#"
                    :style="{ objectFit: fit }"
                    controls
					autoplay
                ></video>
            </div>
        </div>
        <div class="list">
            <ul class="listul">
                <li v-for="(item, i) in items">
                    <input type="checkbox" :id="`${i}_${item.type}`" @click="(e) => changeVideo(e, i)"/>
                    <label :for="`${i}_${item.type}`" :key="i" >
                        <p>
                            <span class="icon material-symbols-outlined" style="position: relative; top: 5px">
                                {{ item.type == 'directory' ? 'folder' : 'draft' }}
                            </span>
                            {{ i + 1 + '. ' }} {{ item.name }}
                        </p>
                    </label>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped>
$hover-color: #474747;
.player {
    margin-top: 3rem;
    display: flex;
    width: 100%;
    justify-content: center;
    flex-direction: row;
    height: 80vh;

    .videoplayer {
        background-color: #00000052;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        height: inherit;

        .video-wrapper {
            flex-grow: 1;
            overflow: hidden;
            video {
                width: 100%;
                height: 100%;
                background-color: rgb(10, 10, 10);
            }
        }
        h2 {
            padding-left: 2rem;
        }
    }

    .list {
        user-select: none;
        flex-basis: 25%;
        height: -webkit-fill-available;
        overflow-y: auto;
        font-size: 14px;

        p {
            margin: 0;
        }

        ul.listul {
            all: unset;
            margin: 0;
            padding: 0;

            li {
                list-style: none;
                .icon {
                    padding: 0 0.5rem;
                }
            }
        }

        input[type='checkbox'] {
            display: none;
        }

		input[type='checkbox']:checked + label {
			text-decoration: line-through;
			color:#ffffff52;
		}

        a,
        label {
            cursor: pointer;
            word-wrap: break-word;
            text-decoration: none;
            display: block;
            padding: 1rem;
            color: #f9f9f9;
            background-color: transparent;
            transition: background 0.1s;

            &:hover {
                background-color: $hover-color;
            }
        }
    }

    @media screen and (max-width: 1188px) {
        flex-direction: column;
        height: auto;
    }
}
</style>
