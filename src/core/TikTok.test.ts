/* eslint-disable no-undef */
import fs from 'fs';
import { ScrapeType, Result, RequestQuery, Challenge, UserData } from '../types';
import { TikTokScraper } from './TikTok';
import CONST from '../constant';

jest.mock('request-promise-native');
jest.mock('request-promise');

describe('TikTok Scraper MODULE(promise): user(valid input data)', () => {
    let instance;
    beforeAll(() => {
        instance = new TikTokScraper({
            download: false,
            asyncDownload: 5,
            filetype: '',
            filepath: '',
            input: 'tiktok',
            type: 'user',
            userAgent: 'Custom User-Agent',
            proxy: '',
            number: 5,
        });
    });

    it('user input should not be empty', async () => {
        expect(instance).toBeInstanceOf(TikTokScraper);
        expect(instance.input).toContain('tiktok');
    });

    it('set custom user-agent', async () => {
        expect(instance).toBeInstanceOf(TikTokScraper);
        expect(instance.userAgent).toContain('Custom User-Agent');
    });

    it('tac value should not be empty', async () => {
        expect(instance.tacValue).not.toEqual(undefined);
    });

    it('getUserId should return a valid Object', async () => {
        const userId: RequestQuery = await instance.getUserId();
        expect(userId).toEqual({ id: '5831967', secUid: '', type: 1, count: 30, minCursor: 0, lang: '' });
    });

    it('result should contain array value with the length 5', async () => {
        const posts: Result = await instance.scrape();
        expect(posts.collector.length).toEqual(5);
    });
});

describe('TikTok Scraper MODULE(event): user(valid input data)', () => {
    let instance;
    beforeAll(() => {
        instance = new TikTokScraper({
            download: false,
            asyncDownload: 5,
            filetype: '',
            filepath: '',
            input: 'tiktok',
            type: 'user',
            userAgent: 'Custom User-Agent',
            proxy: '',
            number: 1,
            event: true,
        });
    });

    it('result should emit "data" event with the result', done => {
        instance.on('data', data => {
            expect(data).toEqual({
                authorDigg: 3555,
                authorFans: 40431380,
                authorFollowing: 932,
                authorHeart: '2426012173',
                authorId: '5831967',
                authorName: 'charlidamelio',
                authorPrivate: false,
                authorSignature: 'don’t worry i don’t get the hype either',
                authorVerified: true,
                authorVideo: 1072,
                commentCount: 46142,
                createTime: '1584953968',
                diggCount: 1563781,
                hashtags: [],
                id: '6807325450981969158',
                imageUrl: 'https://p16-va-default.akamaized.net/obj/tos-maliva-p-0068/a43b061c19c445d78587fb775e7c0175_1584953972',
                musicAuthor: 'sewshiii',
                musicId: '6799337212367407877',
                musicName: 'FOLLOW MY IG... SEWSHIII',
                musicOriginal: true,
                playCount: 5893701,
                shareCount: 6728,
                text: '',
                videoUrl:
                    'https://v16.muscdn.com/a01ef53a726eea58a7ce538ee46f8d5f/5e793956/video/tos/useast2a/tos-useast2a-ve-0068c004/6372449d2b1f4236b06a56da83e54b44/?a=1233&br=1944&bt=972&cr=0&cs=0&dr=0&ds=3&er=&l=202003231633420101890741591D500B49&lr=tiktok_m&qs=0&rc=andsa3N1d3U6czMzOzczM0ApNDk4ZmVlOTw1NzloNDpoNGc1YDI0ay0xaHBfLS0wMTZzc18wMjEtY14xYV80Y14xM2I6Yw%3D%3D&vl=&vr=',
                videoUrlNoWaterMark: '',
                downloaded: false,
            });
            done();
        });
        instance.scrape();
    });

    it('result should emit "done" event if task was completed', done => {
        instance.on('done', data => {
            expect(data).toEqual('completed');
            done();
        });
        instance.scrape();
    });
});

describe('TikTok Scraper MODULE(promise): user(invalid input data)', () => {
    it('Throw error if username is empty', () => {
        const instance = new TikTokScraper({
            download: false,
            asyncDownload: 5,
            filetype: '',
            filepath: '',
            input: '',
            type: 'user',
            userAgent: 'http',
            proxy: '',
            number: 5,
        });
        expect(instance.scrape()).rejects.toEqual('Missing input');
    });

    it('Throw error if wrong scraping type was provided', () => {
        const instance = new TikTokScraper({
            download: false,
            asyncDownload: 5,
            filetype: '',
            filepath: '',
            input: '',
            type: 'fake' as ScrapeType,
            userAgent: 'http',
            proxy: '',
            number: 5,
        });
        expect(instance.scrape()).rejects.toEqual(`Missing scraping type. Scrape types: ${CONST.scrape} `);
    });
});

describe('TikTok Scraper MODULE(event): user(invalid input data)', () => {
    it('Throw error if username is empty', done => {
        const instance = new TikTokScraper({
            download: false,
            asyncDownload: 5,
            filetype: '',
            filepath: '',
            input: '',
            type: 'user',
            userAgent: 'http',
            proxy: '',
            number: 1,
            event: true,
        });
        instance.on('error', data => {
            expect(data).toEqual('Missing input');
            done();
        });
        instance.scrape();
    });

    it('Throw error if wrong scraping type was provided', done => {
        const instance = new TikTokScraper({
            download: false,
            asyncDownload: 5,
            filetype: '',
            filepath: '',
            input: '',
            type: 'fake' as ScrapeType,
            userAgent: 'http',
            proxy: '',
            number: 5,
            event: true,
        });
        instance.on('error', data => {
            expect(data).toEqual(`Missing scraping type. Scrape types: ${CONST.scrape} `);
            done();
        });
        instance.scrape();
    });
});

describe('TikTok Scraper MODULE(promise): user(save to a file)', () => {
    let instance;
    let posts: Result;
    beforeAll(async () => {
        jest.spyOn(fs, 'writeFile').mockImplementation((file, option, cb) => cb(null));

        instance = new TikTokScraper({
            download: false,
            asyncDownload: 5,
            filetype: 'all',
            filepath: '',
            input: 'tiktok',
            type: 'user',
            userAgent: 'http',
            proxy: '',
            number: 5,
        });

        posts = await instance.scrape();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('fs.WriteFile should be called 2 times. Save to a csv and json', async () => {
        expect(fs.writeFile).toHaveBeenCalledTimes(2);
    });

    it('result should contain a valid file names for the csv and json files', async () => {
        expect(posts.csv).toMatch(/^(\w+)_([0-9]{13}).csv$/);
        expect(posts.json).toMatch(/^(\w+)_([0-9]{13}).json$/);
    });
});

describe('TikTok Scraper MODULE(promise): hashtag(valid input data)', () => {
    let instance;
    beforeAll(() => {
        instance = new TikTokScraper({
            download: false,
            asyncDownload: 5,
            filetype: '',
            filepath: '',
            input: 'summer',
            type: 'hashtag',
            userAgent: 'http',
            proxy: '',
            number: 5,
        });
    });

    it('hashtag input should not be empty', async () => {
        expect(instance).toBeInstanceOf(TikTokScraper);
        expect(instance.input).toContain('summer');
    });

    it('getHashTagId should return a valid Object', async () => {
        const hashtag: RequestQuery = await instance.getHashTagId();
        expect(hashtag).toEqual({ id: '4100', secUid: '', type: 3, count: 48, minCursor: 0, lang: '' });
    });

    it('result should contain array value with the length 5', async () => {
        const posts: Result = await instance.scrape();
        expect(posts.collector.length).toEqual(5);
    });
});

describe('TikTok Scraper MODULE(promise): signUrl', () => {
    let instance;
    beforeAll(() => {
        instance = new TikTokScraper({
            download: false,
            asyncDownload: 5,
            filetype: '',
            filepath: '',
            input: 'https://m.tiktok.com/share/item/list?secUid=&id=355503&type=3&count=30&minCursor=0&maxCursor=0&shareUid=&lang=',
            type: 'signature',
            userAgent: 'http',
            proxy: '',
            number: 5,
        });
    });
    it('signUrl should return a valid signature', async () => {
        const signature: string = await instance.signUrl();
        expect(signature).toEqual('TYYDvAAgEBosHbdFdlDDM02GAqAABQA');
    });

    it('Throw error if input url is empty', () => {
        instance.input = '';
        expect(instance.signUrl()).rejects.toEqual('Url is missing');
    });
});

describe('TikTok Scraper MODULE(promise): getHashtagInfo', () => {
    let instance;
    const hasthagName = 'summer';
    beforeAll(() => {
        instance = new TikTokScraper({
            download: false,
            asyncDownload: 5,
            filetype: '',
            filepath: '',
            input: hasthagName,
            type: 'single_hashtag',
            userAgent: 'http',
            proxy: '',
            number: 5,
        });
    });
    it('getHashtagInfo should return a valid Object', async () => {
        const hashtag: Challenge = await instance.getHashtagInfo();
        expect(hashtag).toEqual({
            challengeId: '4100',
            challengeName: hasthagName,
            text: `Beach, sun, fun!\nDo you have some cool ${hasthagName} videos? Upload them with the hashtag #${hasthagName}.`,
            covers: [],
            coversMedium: [],
            posts: 3088974,
            views: '6226592362',
            isCommerce: false,
            splitTitle: '',
        });
    });

    it('Throw error if input hashtag is empty', () => {
        instance.input = '';
        expect(instance.getHashtagInfo()).rejects.toEqual(`Hashtag is missing`);
    });

    it(`Throw error if hashtag doesn't exist`, () => {
        instance.input = 'na';
        expect(instance.getHashtagInfo()).rejects.toEqual(`Can't find hashtag: na`);
    });
});

describe('TikTok Scraper MODULE(promise): getUserProfileInfo', () => {
    let instance;
    const userName = 'tiktok';
    beforeAll(() => {
        instance = new TikTokScraper({
            download: false,
            asyncDownload: 5,
            filetype: '',
            filepath: '',
            input: userName,
            type: 'single_user',
            userAgent: 'http',
            proxy: '',
            number: 5,
        });
    });
    it('getUserProfileInfo should return a valid Object', async () => {
        const user: UserData = await instance.getUserProfileInfo();
        expect(user).toEqual({
            secUid: 'MS4wLjABAAAA-VASjiXTh7wDDyXvjk10VFhMWUAoxr8bgfO1kAL1-9s',
            userId: '5831967',
            isSecret: false,
            uniqueId: userName,
            nickName: 'Test User',
            signature: 'don’t worry i don’t get the hype either',
            covers: ['https://p16.muscdn.com/img/musically-maliva-obj/1655662764778502~c5_100x100.jpeg'],
            coversMedium: ['https://p16.muscdn.com/img/musically-maliva-obj/1655662764778502~c5_720x720.jpeg'],
            following: 932,
            fans: 40421477,
            heart: '2425050211',
            video: 1071,
            verified: true,
            digg: 3553,
        });
    });

    it('Throw error if input username is empty', () => {
        instance.input = '';
        expect(instance.getUserProfileInfo()).rejects.toEqual(`Username is missing`);
    });

    it(`Throw error if username doesn't exist`, () => {
        instance.input = 'na';
        expect(instance.getUserProfileInfo()).rejects.toEqual(`Can't find user: na`);
    });
});

describe('TikTok Scraper CLI: user(save progress)', () => {
    let instance;
    let posts: Result;
    beforeAll(async () => {
        jest.spyOn(fs, 'writeFile').mockImplementation((file, option, cb) => cb(null));
        jest.spyOn(fs, 'readFile').mockImplementation((file, cb) => cb(null, Buffer.from('0')));

        instance = new TikTokScraper({
            download: true,
            cli: true,
            store_history: true,
            test: true,
            asyncDownload: 5,
            filetype: '',
            filepath: '',
            input: 'tiktok',
            type: 'user',
            userAgent: 'http',
            proxy: '',
            number: 5,
        });
        posts = await instance.scrape();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('fs.readFile should be called once', async () => {
        expect(fs.readFile).toHaveBeenCalledTimes(1);
    });

    it('fs.writeFile should be called once', async () => {
        expect(fs.writeFile).toHaveBeenCalledTimes(1);
    });

    it('result should contain a valid file name for the Zip file', async () => {
        expect(posts.zip).toMatch(/^(\w+)_([0-9]{13}).zip$/);
    });
});
