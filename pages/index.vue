<template>
  <div class="page-index">
    <!-- 背景 -->
    <video muted loop class="video-bg" autoplay playsinline>
      <source src="/videos/IMG_6322228.MP4" type="video/mp4" />
    </video>
    <!-- 顶部 -->
    <div class="container">
      <!-- 标题 -->
      <div class="page-title">
        <h1>{{ $t('PageHome.text1') }}</h1>
        <h2><span v-html="$t('PageHome.text2')"></span></h2>
      </div>
      <!-- 操作池 -->
      <div class="operation-pool">
        <div class="pool-aintext">
          <el-button type="text" @click="toRoute('https://app.selltoken.org/#/swap')">{{ $t('PageHeader.Swap') }}</el-button>
          <el-button type="text" @click="toRoute('/miner')">{{ $t('PageHeader.Miner') }}</el-button>
          <el-button type="text" @click="toRoute('/liquidity')">{{ $t('PageHeader.Liquidity') }}</el-button>
        </div>
        <auto-search @select="onSelectCoinbase" @clear="onClearSelectInfo" ref="autoSearchRef"
          :content="$t(`new03.text1_${nowChainName}`)"></auto-search>
        <h3 class="pair-h3">{{ $t('PageHome.text3') }}</h3>
        <div class="pair-content">
          <div class="unitem" 
            v-for="(item, index) in pairLists" :key="index"
            :class="{active: selectPairIndex === index}" >
            <img :src="require(`~/static/images/${item}.png`)" alt="">
            <span>{{ item }}</span>
          </div>
        </div>
        <div class="no-pair">
          <span v-if="selectInfo && selectPairIndex<0">{{ $t('noPair') }}</span>
        </div>
        <!-- 输入金额 -->
        <div class="write-amount">
          <el-input-number 
            v-model="amountNumber" controls-position="right" 
            :min="0.0000001" :step="0.1">
          </el-input-number>
          <div class="amount-unit">
            <img :src="require(`~/static/images/${nowChainName}.png`)" alt="" class="unitico">
            <span>{{ nowChainName }}</span>
          </div>
        </div>
        <div class="slider-linebox">
          <el-slider v-model="sliderLineValue" :min="25" :step="25" show-stops :marks="sliderMarks"
            @change="onChangeSlider"></el-slider>
        </div>
        <div class="max-short">
          <p>
            {{ $t('PageHome.text4') }}:
            <b>{{ maxAmountShort }}</b>
            <i v-if="queryMaxLoading" class="el-icon-loading"></i>
            {{ nowChainName }}</p>
        </div>
        <div class="shortbtn-cell">
          <el-button 
            :disabled="!addr2Token||!selectInfo||selectInfo.pairs=='No pair'"
            @click="onSetShort">
            {{ $t('PageHome.text5') }}
          </el-button>
          <el-button class="btncolor2" @click="toLiquidity"
            :disabled="!selectInfo">
            {{ $t('PageHome.text6') }}
          </el-button>
        </div>
      </div>
      <!-- 奖池 -->
      <div class="jackpot-box">
        <div class="jack-item">
          <div class="j-radius"></div>
          <div class="j-title">
            <h6>{{ $t('PageHome.text7') }}</h6>
          </div>
          <div class="j-amount">
            <p>
              <img :src="require(`~/static/images/${nowChainName}.png`)" alt="" class="j-unit">
              <b>{{ shortsInfos[1] || '0.00000000' }}</b>
            </p>
          </div>
          <img src="~/static/images/v1.png" alt="" class="j-ico">
        </div>
        <div class="jack-item">
          <div class="j-radius"></div>
          <div class="j-title">
            <h6>{{ $t('PageHome.text5') }}</h6>
          </div>
          <div class="j-amount">
            <p>
              <img :src="require(`~/static/images/${nowChainName}.png`)" alt="" class="j-unit">
              <b>{{ shortsInfos[0] || '0.00000000' }}</b>
            </p>
          </div>
          <img src="~/static/images/v2.png" alt="" class="j-ico">
        </div>
        <div class="jack-item">
          <div class="j-radius"></div>
          <div class="j-title">
            <h6>{{ $t('PageHome.text6') }}</h6>
          </div>
          <div class="j-amount">
            <p class="size-text">
              {{ $t('PageHome.text8') }}：
              <img :src="coinbaseIcos[selectInfo?selectInfo.name:'']||require('~/static/images/defaultico.png')" alt="" class="j-unit">
              <b>{{ shortsInfos[2] || '0.0000' }}</b>
            </p>
            <p class="size-text">
              {{ $t('PageHome.text9') }}：
              <img :src="coinbaseIcos[selectInfo?selectInfo.name:'']||require('~/static/images/defaultico.png')" alt="" class="j-unit">
              <b>{{ shortsInfos[3] || '0.0000' }}</b>
            </p>
            <p class="size-text">
              {{ $t('PageHome.text10') }}：
              <b>{{ (((shortsInfos[3]/shortsInfos[2])*100)||0).toFixed(2) }}%</b>
            </p>
          </div>
          <img src="~/static/images/v3.png" alt="" class="j-ico">
        </div>
      </div>
    </div>
    <!-- 做空池项目 -->
    <div class="make-pool" v-if="dexList.length">
      <div class="container">
        <div class="make-title">
          <h2>{{ $t('new06.text9') }}</h2>
          <p>SHORT POOL ITEMS</p>
          <div class="make-line">
            <span>{{ $t('new06.text10') }}</span>
          </div>
        </div>
        <div class="swiper-pools" v-swiper:mySwiper="SwiperPool">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(item, index) in dexList" :key="index"
              @click="onSelectDex(item)">
              <img :src="item.icon || require('~/static/images/defaultico.png')" class="aico" />
              <p>{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination-pool"></div>
    </div>
    <!-- 订单 -->
    <div class="orderinfo-box">
      <div class="swiper-orderinfo" v-swiper:mySwiperOrder="SwiperOptions">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) in myOrderLists" :key="index">
            <div class="orderinfo-item">
              <img src="~/static/images/vinitembg.png" alt="" class="vimg-bg">
              <div class="coin-colors"
                :style="{backgroundColor: item[2]-item[1]>=0 ? '#48c774' : 'red'}"></div>
              <div class="o-top">
                <div class="ot-logo">
                  <img :src="coinbaseIcos[item[3]]||require('~/static/images/defaultico.png')" alt="">
                </div>
                <strong>{{ $t('new01.text1') }}</strong>
                <div class="o-types">
                  <b>{{ $t('new01.text2') }}</b>
                  <span v-if="item[4] != 'No pair'">{{ item[4] }}/{{ item[3] }}</span>
                  <span v-else>{{ item[4] }}</span>
                </div>
              </div>
              <div class="o-info">
                <div class="o-addr">
                  <div class="o-tag">{{ $t('new01.text3') }}</div>
                  <span>{{ item[0].substr(0, 4) }}...{{ item[0].substr(-6) }}</span>
                  <img src="~/static/images/copyico.png" alt="" class="copybtn"
                    @click="onCopyText(item[0])">
                </div>
                <div class="oflex-cell">
                  <div class="o-price">
                    $
                    {{ item[5] }}
                  </div>
                  <div class="o-rate">
                    <span :style="{color: item[2]-item[1]>=0 ? '#48c774' : 'red'}"
                      v-if="item[2]!=0">
                      {{ item[2]-item[1]>=0 ? '+' : '' }}
                      {{ (item[2]/item[1]*100-100).toFixed(2) }}%
                    </span>
                    <span v-else>
                      0.00%
                    </span>
                  </div>
                </div>
                <div class="o-cellitem">
                  <span>{{ $t('new01.text4') }}</span>
                  <i class="oline"></i>
                  <strong>
                    <img :src="require(`~/static/images/${nowChainName}.png`)" class="sico" />
                    {{ item[1] }}
                  </strong>
                </div>
                <div class="o-cellitem">
                  <span>{{ $t('new01.text5') }}</span>
                  <i class="oline"></i>
                  <strong>
                    <img :src="require(`~/static/images/${nowChainName}.png`)" class="sico" />
                    {{ item[2] }}
                  </strong>
                </div>
                <div class="cp-btnbox">
                  <div class="inbtntext" :class="{disabled: item[0]==0}" @click="onClosePostion(item[0])">
                    <span>{{ $t('PageHome.text7') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
    <!-- IDO -->
    <!-- <div class="ido-content" >
      <h2>SELLC IDO</h2>
      <div class="container">
        <div class="disc-box">
          <div class="timecount-statistic" v-if="!isEndTime">
            <span>{{ $t('PageHome.text16') }}</span>
            <b>{{ endTimeIDO[0] }}</b>
            <span>{{ $t('PageHome.text17') }}</span>
            <b>{{ endTimeIDO[1] }}</b>
            <span>{{ $t('PageHome.text18') }}</span>
            <b>{{ endTimeIDO[2] }}</b>
            <span>{{ $t('PageHome.text19') }}</span>
            <b>{{ endTimeIDO[3] }}</b>
            <span>{{ $t('PageHome.text20') }}</span>
          </div>
          <div class="timecount-statistic" v-else>
            <b style="border:0">{{ $t('new06.text5') }}...</b>
          </div>
          <div class="sline">
            <div class="slineitem"></div>
          </div>
          <div class="disc-join">
            <div class="ido-number">
              <p>{{ $t('new06.text1') }}： {{ idoNumber }} {{ nowChainName }}</p>
              <p><small>{{ $t('new06.text2') }}</small><small>{{ $t('new06.text3') }}</small></p>
            </div>
            <div class="input-box">
              <el-input-number :controls="false" :placeholder="`Amount Value ${nowChainName}`"
                step-strictly :step="0.01" :precision="2"
                v-model="idoValue" :min="0.1" :max="2"></el-input-number>
              <div class="unit-max" v-if="idoValue">
                <span>{{ nowChainName }}</span>
              </div>
            </div>
            <div class="mxbtn">
              <span class="price">{{ $t('new06.text4') }}: $ 0.013</span>
              <el-button type="text"
                @click="idoValue = 2">
                MAX 2 {{ nowChainName }}
              </el-button>
            </div>
            <div>
              <el-button type="primary" :disabled="!idoValue||isEndTime" class="themebtn" :loading="idoLoading"
                @click="onIntoIDO">{{ $t('PageHome.text21') }}</el-button>
            </div>
          </div>
          <div class="invite-address">
            <span>
              <small>{{ $t('new05.text3') }}</small>
              <strong>{{ inviteLink.substr(0, 10) + '...' + inviteLink.substr(-6) }}</strong>
            </span>
            <i class="el-icon-document" @click="onCopyText(inviteLink)"></i>
          </div>
        </div>
      </div>
    </div> -->
    <!-- mind map -->
    <div class="mindmap-video">
      <video muted loop width="100%" style="margin:auto;" autoplay playsinline>
        <source :src="`/lang/videos/${$i18n.locale}.mp4`" type="video/mp4">
      </video>
      <img :src="`/lang/images/${$i18n.locale}.png`" alt="" class="flow-img">
    </div>
    <!-- dife link -->
    <div class="dife-linkbox">
      <div class="container">
        <div class="dife-info">
          <h3 v-html="$t('PageHome.text22')"></h3>
          <p>{{ $t('PageHome.text23') }}</p>
        </div>
      </div>
      <div class="difelink-title">
        <h2>{{ $t('new06.text7') }}</h2>
      </div>
      <div class="link-logo">
        <ul class="link-line-item linitem2">
          <li
            v-for="(item, index) in aLinkItem3" :key="index">
            <a :href="item.link" target="_blank">
              <img :src="item.icon" alt="" :style="{
                backgroundColor: item.color,
                width: item.width,
                height: item.height
              }">
              <span>{{ item.name }}</span>
            </a>
          </li>
        </ul>
        <div class="difelink-title" style="margin-top: 50px;">
          <h2>{{ $t('new06.text8') }}</h2>
        </div>
        <ul class="link-line-item">
          <li
            v-for="(item, index) in aLinkItem1" :key="index">
            <a :href="item.link" target="_blank">
              <img :src="item.icon" alt="" :style="{
                backgroundColor: item.color,
                width: item.width,
                height: item.height
              }">
              <span>{{ item.name }}</span>
            </a>
          </li>
        </ul>
        <ul class="link-line-item linitem2">
          <li
            v-for="(item, index) in aLinkItem2" :key="index">
            <a :href="item.link" target="_blank">
              <img :src="item.icon" alt="" :style="{
                backgroundColor: item.color,
                width: item.width,
                height: item.height
              }">
              <span>{{ item.name }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <!-- charts -->
    <el-dialog
      :visible.sync="showChartsModal"
      width="500px"
      custom-class="customCharts-dialog">
      <div id="modalCharts" class="charts-box"></div>
    </el-dialog>
    <!-- charts modal -->
    <el-dialog
      width="600px"
      :visible.sync="showChartsModalInfo"
      center
      custom-class="customCharts-info">
      <div slot="title" class="charts-modal-title">
        <h2>
          <img src="~/static/images/vnotice1.png" />
          {{ $t('new03.text4') }}
        </h2>
      </div>
      <div class="charts-modal-content">
        <el-image 
          width="100%"
          :src="require('~/static/images/dropimg.jpg')" 
          :preview-src-list="[require('~/static/images/dropimg.jpg')]">
        </el-image>
        <!-- <div class="prxin">
          <h3>{{ $t('new03.text5') }}</h3>
          <p>
            {{ $t('new03.text6') }} <br>
            {{ $t('new03.text7') }} <br>
            {{ $t('new03.text8') }} <br>
            {{ $t('new03.text9') }}
          </p>
        </div>
        <h3>{{ $t('new03.text10') }}</h3>
        <p>
          1、{{ $t('new03.text11') }} <br>
          2、{{ $t('new03.text12') }} <br>
        </p>
        <h3>{{ $t('new03.text13') }}</h3>
        <p>1、{{ $t('new03.text14') }}</p> -->
        <div class="charts-foot-address">
          <span>{{ $t('new03.text15') }}</span>
          <b>0xa645995e9801f2ca6e2361edf4c2a138362bade4</b>
          <img src="~/static/images/copyico.png" 
            @click="onCopyText('0xa645995e9801f2ca6e2361edf4c2a138362bade4')" />
        </div>
        <div class="charts-fixed-right">
          <strong>5%</strong>
          <small>{{ $t('new03.text16') }}</small>
        </div>
      </div>
    </el-dialog>
    <!-- loading -->
    <el-dialog
      :visible.sync="countLoading"
      width="500px"
      custom-class="customCharts-dialog"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      fullscreen
      center>
      <div class="closeloading-box">
        <h5 class="count-text">{{ 30 - count }}</h5>
        <!-- <p class="wait-text">请稍等...</p> -->
        <!-- <iframe 
          width="350px" height="350px" frameborder="0"
          src="/loading.html?q=%E9%98%B2%E6%AD%A2%E9%97%AA%E7%94%B5%E8%B4%B7%E6%94%BB%E5%87%BB">
        </iframe> -->
        <div id="loadingGauge" style="width: 100%; height: 500px;"></div>
        <div class="gapico"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: 'IndexPage',
  data () {
    return {
      initCharts: false,
      showChartsModalInfo: false,
      nowSelectChartsInfo: {},
      showChartsModal: false,
      sliderMarks: {
        0: '0%',
        25: '25%',
        50: '50%',
        75: '75%',
       100: '100%',
      },
      sliderLineValue: 0,
      aLinkItem3: [
        {
          icon: require('~/static/images/vlogo4.webp'),
          name: '',
          link: 'https://www.pinksale.finance/',
          height: '100px',
          width: '200px'
        },
        {
          icon: require('~/static/images/vlogo5.png'),
          name: 'Marketing',
          link: 'https://t.me/Dwen_Exchange'
        },
        {
          icon: require('~/static/images/vlogo6.png'),
          name: '',
          link: 'https://www.dexview.com/',
          height: '80px',
          width: '160px'
        },
        {
          icon: require('~/static/images/vlogo1.jpeg'),
          name: 'BSCDaily',
          link: 'https://twitter.com/bsc_daily'
        },
        {
          icon: require('~/static/images/vlogo2.png'),
          name: 'BSCNews',
          link: 'https://www.bsc.news/'
        },
        {
          icon: require('~/static/images/diamond.jpeg'),
          name: '',
          link: 'https://d65535.com/DMS_Global',
          height: '80px',
          width: '180px'
        },
        {
          icon: require('~/static/images/we.png'),
          name: '',
          link: 'https://www.coingecko.com/',
          height: '80px',
          width: '180px'
        }
      ],
      aLinkItem1: [
        {
          icon: require('~/static/images/Arbitrum.svg'),
          name: 'Arbitrum',
          link: '#'
        },
        {
          icon: require('~/static/images/Avalanche.svg'),
          name: 'Avalanche',
          link: '#'
        },
        {
          icon: require('~/static/images/Binance.svg'),
          name: 'Binance',
          link: '#'
        },
        {
          icon: require('~/static/images/Ethereum.svg'),
          name: 'Ethereum',
          link: '#'
        },
        {
          icon: require('~/static/images/Solana.svg'),
          name: 'Solana',
          link: '#'
        },
        {
          icon: require('~/static/images/Fandom.svg'),
          name: 'Fantom',
          link: '#'
        },
        {
          icon: require('~/static/images/vlogo3.svg'),
          name: 'CERTIK',
          link: 'https://certik.com',
          color: '#000'
        }
      ],
      aLinkItem2: [
        {
          icon: require('~/static/images/Moonbeam.svg'),
          name: 'Moonbeam',
          link: '#'
        },
        {
          icon: require('~/static/images/Near.svg'),
          name: 'Near',
          link: '#'
        },
        {
          icon: require('~/static/images/Nervos.svg'),
          name: 'Nervos',
          link: '#'
        },
        {
          icon: require('~/static/images/Optimism.svg'),
          name: 'Optimism',
          link: '#'
        },
        {
          icon: require('~/static/images/Polygon.svg'),
          name: 'Polygon',
          link: '#'
        },
        {
          icon: require('~/static/images/Harmony.svg'),
          name: 'Harmony',
          link: '#'
        },
        {
          icon: require('~/static/images/Iotex.svg'),
          name: 'IoTeX',
          link: '#'
        }
      ],
      SwiperOptions: {
        slidesPerView: 5,
        spaceBetween: 30,
        slidesPerGroup: 1,
        loop: false,
        loopFillGroupWithBlank: false,
        autoplay: false,
        breakpoints: {
          1920: {
            slidesPerView: 4,
            spaceBetween: 30,
            slidesPerGroup: 1,
          },
          1440: {
            slidesPerView: 3,
            spaceBetween: 20,
            slidesPerGroup: 1,
          },
          1080: {
            slidesPerView: 2,
            spaceBetween: 30,
            slidesPerGroup: 1,
          },
          750: {
            slidesPerView: 1,
            spaceBetween: 30,
            slidesPerGroup: 1,
          },
          300: {
            slidesPerView: 1,
            spaceBetween: 10,
            slidesPerGroup: 1,
          }
        },
        navigation: {
          nextEl: '.orderinfo-box .swiper-button-next',
          prevEl: '.orderinfo-box .swiper-button-prev',
        }
      },
      SwiperPool: {
        slidesPerView: 5,
        spaceBetween: 30,
        slidesPerGroup: 6,
        loop: false,
        loopFillGroupWithBlank: false,
        autoplay: false,
        observeParents: true,
        observer: true,
        breakpoints: {
          1920: {
            slidesPerView: 6,
            spaceBetween: 30,
            slidesPerGroup: 6,
          },
          1440: {
            slidesPerView: 6,
            spaceBetween: 20,
            slidesPerGroup: 6,
          },
          1080: {
            slidesPerView: 6,
            spaceBetween: 30,
            slidesPerGroup: 6,
          },
          750: {
            slidesPerView: 4,
            spaceBetween: 30,
            slidesPerGroup: 4,
          },
          300: {
            slidesPerView: 4,
            spaceBetween: 10,
            slidesPerGroup: 4,
          }
        },
        pagination: {
          el: '.make-pool .swiper-pagination-pool',
          clickable: true
        }
      },
      selectValue: '',
      selectInfo: null,
      selectPairIndex: -1,
      amountNumber: 0.1,
      shortsInfos: {},
      miningUserInfos: {},
      maxAmountShort: '0.00000000',
      myOrderLists: [
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: 'No pair'
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: 'No pair'
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: 'No pair'
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: 'No pair'
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: 'No pair'
        },
        {
          0: '0x0000000000000000000000000000000000000000',
          1: '0.00000000',
          2: '0.00000000',
          3: '',
          4: ''
        }
      ],
      queryMaxLoading: false,
      countLoading: false,
      count: 0,
      timers: {0:null, 1:null,2:null,3:null,4:null}, // 定时器
      idoValue: '',
      idoLoading: false,
      endTimeIDO: ['00', '00', '00', '00'],
      isEndTime: false,
      idoNumber: 0,
      dexList: []
    }
  },
  computed: {
    addr2Token () {
      return this.commonAddrs[this.pairLists[this.selectPairIndex]];
    },
    coinbaseIcos () {
      return this.$store.state.coinbaseIcos;
    },
    walletAddress () {
      return this.$store.state.wallet.walletAddress;
    },
    commonAddrs () {
      return this.$store.state.wallet.commonAddrs;
    },
    pairLists () {
      return this.$store.state.wallet.pairLists;
    },
    nowChainName () {
      return this.$store.state.wallet.nowChainName;
    },
    inviteAddress () {
      return this.$store.state.wallet.inviteAddress || '0x4b9Ad0eD12C630AF0726e0E4822eE84d43D7E8E5';
    },
    inviteLink () {
      return process.browser ? globalThis.location.origin + '?addr=' + this.walletAddress : '';
    }
  },
  created () {
    this.queryMyOrderSell()
    this.queryNumberIDO()
  },
  destroyed () {
    for (let k in this.timers) {
      clearTimeout(this.timers[k])
      clearInterval(this.timers[k])
    }
  },
  mounted () {
    this.getCoinList()
  },
  methods: {
    async getCoinList () {
      this.$axios.get('/coinbase.json')
      .then(({ data }) => {
        this.dexList = data;
      })
    },
    onSelectDex (item) {
      item.isAdd = true
      this.$refs.autoSearchRef.handleSelectCoinbase(item)
    },
    async queryNumberIDO () {
      const { methods } = await this.$store.dispatch('contract/event', 'IDO');
      clearTimeout(this.timers[4])
      methods.sum().call((err, res) => {
        if (!err) {
          this.idoNumber = (res/Math.pow(10,18)).toFixed(8)
        }
        this.timers[4] = setTimeout(() => {
          this.queryNumberIDO()
        }, 10*1000)
      })
    },
    startCountIDO () {
      const endTime = new Date('2023/04/08 23:00:00').getTime();
      const nowTime = Date.now();
      let d1 = (endTime - nowTime)/1000/24/60/60;
      if (d1 < 0) {
        this.isEndTime = true;
        return false;
      }
      let d2 = parseInt(d1);
      let h1 = (d1-d2)*24;
      let h2 = parseInt(h1);
      let m1 = (h1-h2)*60;
      let m2 = parseInt(m1);
      let s1 = (m1-m2)*60;
      let s2 = parseInt(s1);
      if (d2<10) d2 = '0'+d2;
      if (h2<10) h2 = '0'+h2;
      if (m2<10) m2 = '0'+m2;
      if (s2<10) s2 = '0'+s2;
      this.endTimeIDO = [d2, h2, m2, s2];
      clearTimeout(this.timers[3]);
      this.timers[3] = setTimeout(() => {
        this.startCountIDO()
      }, 1000)
    },
    async onIntoIDO () {
      this.idoLoading = true;
      const { methods } = await this.$store.dispatch('contract/event', 'IDO');
      const payAmount = web3.utils.toWei(String(this.idoValue));
      methods.inIdo(this.inviteAddress).send({
        value: payAmount
      },(err, txHash) => {
        this.idoLoading = false;
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async initRenderGauge () {
      const color = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 0,
          color: '#ee6d21',
        },
        {
          offset: 1,
          color: '#21ee41',
        },
      ]);
      const option = {
        series: [
          {
            type: 'gauge',
            startAngle: 190,
            endAngle: -10,
            min: 0,
            max: 30,
            splitNumber: 12,
            progress: {
              show: true,
              width: 18,
              itemStyle: {
                color:  color,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 5,
                shadowOffsetY: 2,
                borderWidth: 1
              }
            },
            pointer: {
              icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
              length: '80%',
              width: 16,
              offsetCenter: [0, '5%']
            },
            axisLine: {
              lineStyle: {
                width: 18
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              width: '60%',
              lineHeight: 40,
              height: 40,
              borderRadius: 8,
              fontSize: 16,
              offsetCenter: [0, '30%'],
              valueAnimation: true,
              color: '#ffffff',
              formatter: (value) => {
                return this.count < 30 ? this.$t('new05.text1') : this.$t('new05.text2');
              }
            },
            data: [
              {
                value: this.count,
                itemStyle: {
                  color: 'rgba(255,255,255,0.5)'
                }
              },
              {
                value: 30,
                itemStyle: {
                  color: 'rgba(0,0,0,0)'
                }
              }
            ]
          }
        ]
      };
      clearInterval(this.timers[2]);
      return new Promise((resolve) => {
        this.$nextTick(() => {
          // this.initCharts = true
          const myChart = echarts.init(document.getElementById('loadingGauge'));
          myChart.setOption(option);
          this.timers[2] = setInterval(() => {
            if (this.count < 30) {
              option.series[0].data[0].value = this.count++;
              myChart.setOption(option);
            } else {
              clearInterval(this.timers[2]);
              myChart.setOption(option);
              resolve(myChart);
            }
          }, 1000)
        })
      })
    },
    toRoute (url) {
      if (url.startsWith('http')) {
        window.open(url)
      } else {
        this.$router.push(this.localePath(url))
      }
    },
    onChangeSlider () {
      let num = Number(this.maxAmountShort)*this.sliderLineValue/100;
      if (num < 0.0000001) num = 0.1;
      this.amountNumber = num;
    },
    onCopyText (text) {
      this.$copyText(text).then((e) => {
        console.log(e)
        this.$message.success(this.$t('copySuccess'))
      }, () => {
        this.$message.success(this.$t('copyFail'))
      })
    },
    onClearSelectInfo () {
      this.selectInfo = null;
      this.selectPairIndex = -1;
      this.maxAmountShort = '0.00000000';
    },
    onSelectCoinbase (item) {
      this.selectInfo = item;
      this.selectValue = item.addr;
      this.selectPairIndex = this.pairLists.indexOf(item.pairs)
      this.queryShorts()
      this.queryMaxShorts()
      clearInterval(this.timers[1])
      this.timers[1] = setInterval(() => {
        this.queryMaxShorts()
        this.queryShorts()
      }, 10 * 1000)
    },
    async queryCoinbasePrice (index, pairName) {
      const { methods } = await this.$store.dispatch('contract/event');
      let addr1 = this.myOrderLists[index][0];
      let addr2 = this.commonAddrs[pairName];
      console.log(addr1, addr2)
      methods.getToken3Price(addr1, addr2).call((err, res) => {
        if (!err) {
          this.$set(this.myOrderLists[index], 5, (res/Math.pow(10, 18)).toFixed(8))
        }
      })
    },
    async onClosePostion (addr) {
      const { methods } = await this.$store.dispatch('contract/event');
      if (addr == 0) return false;
      methods.withdraw(addr).send((err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async queryMyOrderSell () {
      const { methods } = await this.$store.dispatch('contract/event');
      methods.getMyPriceSell().call((err, res) => {
        if (!err) {
          if (res[0].length) {
            this.myOrderLists = res[0].map((addr, index) => {
              methods.getTokenName(addr).call((err, res) => {
                if (!err) {
                  this.myOrderLists[index][3] = res[0];
                  this.myOrderLists[index][4] = res[1];
                  this.queryCoinbasePrice(index, res[1])
                }
              })
              return {
                0: addr,
                1: (res[1][index]/Math.pow(10,18)).toFixed(8),
                2: (res[2][index]/Math.pow(10,18)).toFixed(8),
                3: '',
                4: '',
                5: ''
              }
            })
          }
          // 查询
          this.timers[0] = setTimeout(this.queryMyOrderSell, 10 * 1000);
        }
      })
    },
    startCount () {
      clearInterval(this.timers[2])
      return new Promise((resolve) => {
        this.timers[2] = setInterval(() => {
          if (this.count < 30) {
            this.count ++
          } else {
            this.count = 0
            this.countLoading = false;
            clearInterval(this.timers[2])
            resolve(true)
          }
        }, 1000)
      })
    },
    async onSetShort () {
      // 校验金额是否超过max
      if (this.amountNumber > this.maxAmountShort) {
        this.$alert(
          this.$t('PageHome.text4') + ' ' + this.maxAmountShort + ' ' + this.nowChainName, 
          this.$t('PageHome.text27'), 
          {
            confirmButtonText: this.$t('PageHome.text29'),
            type: 'warning'
        })
        return false;
      }
      // 校验钱包余额不足
      const walletAmount = await this.$store.dispatch('wallet/queryAmount');
      if (walletAmount < this.amountNumber) {
        return this.$message.warning(this.$t('new02.text7'));
      }
      // 执行操作
      const { methods } = await this.$store.dispatch('contract/event');
      const setGas = this.$store.state.contract.setGas[this.nowChainName];
      methods.setTokenPrice(this.selectValue).send({
        gas: setGas
      }, (err, txHash) => {
        if (!err) {
          this.$store.dispatch('contract/cochainHashSuccess', { txHash })
          this.countLoading = true;
          setTimeout(() => {
            this.initRenderGauge()
            .then((myChart) => {
              this.onOpenShort().then(() => {
                this.count = 0;
                this.countLoading = false;
                myChart.dispose();
              });
            })
          }, 0)
          history.pushState(null, null, document.URL);
          window.onbeforeunload = () => '';
        } else {
          this.$store.dispatch('contract/cochainHashError', { err })
        }
      })
    },
    async onOpenShort () {
      // 执行操作
      const { methods } = await this.$store.dispatch('contract/event');
      const amount = web3.utils.toWei(String(this.amountNumber), 'ether');
      return new Promise((resolve) => {
        methods.ShortStart(this.selectValue, this.walletAddress, 2).send({
          value: amount
        },(err, txHash) => {
          if (!err) {
            this.$store.dispatch('contract/cochainHashSuccess', { txHash })
          } else {
            this.$store.dispatch('contract/cochainHashError', { err })
          }
          resolve(true)
        })
      })
    },
    toLiquidity () {
      const addr1 = this.selectValue;
      const addr2 = this.addr2Token;
      this.$router.push({
        path: this.localePath('/liquidity'),
        query: {
          addr1, addr2
        }
      })
    },
    async queryShorts () {
      const { methods } = await this.$store.dispatch('contract/event');
      methods.getShorts(this.selectValue).call((err, res) => {
        if (!err) {
          console.log(res)
          this.shortsInfos = {
            0: (res[0]/Math.pow(10,18)).toFixed(8),
            1: (res[1]/Math.pow(10,18)).toFixed(8),
            2: (res[2]/Math.pow(10,18)).toFixed(4),
            3: (res[3]/Math.pow(10,18)).toFixed(4),
          }
        }
      })
    },
    async queryMaxShorts () {
      const { methods } = await this.$store.dispatch('contract/event');
      // 查询最大做空
      console.log(this.addr2Token , this.selectValue)
      if (this.addr2Token && this.selectValue) {
        this.queryMaxLoading = true
        methods.getShortsMoV(this.selectValue, this.addr2Token).call((err, res) => {
          this.queryMaxLoading = false
          if (!err) {
            this.maxAmountShort = (Math.min(res/Math.pow(10, 18)/2, 2)).toFixed(8);
            console.log('最大做空:', this.maxAmountShort)
          } else {
            this.maxAmountShort = '0.00000000';
          }
        })
      }
    },
    onChangePairIndex (index) {
      this.selectPairIndex = index;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/pages/index.scss';
.zr0-cls-0 {
animation:zr0-ani-0 0.5s cubic-bezier(0.33,1,0.68,1) 0.5s both;
}
.zr0-cls-1 {
animation:zr0-ani-1 0.5s cubic-bezier(0.33,1,0.68,1) 0.4375s both;
}
.zr0-cls-2 {
animation:zr0-ani-2 0.5s cubic-bezier(0.33,1,0.68,1) 0.375s both;
}
.zr0-cls-3 {
animation:zr0-ani-3 0.5s cubic-bezier(0.33,1,0.68,1) 0.3125s both;
}
.zr0-cls-4 {
animation:zr0-ani-4 0.5s cubic-bezier(0.33,1,0.68,1) 0.25s both;
}
.zr0-cls-5 {
animation:zr0-ani-5 0.5s cubic-bezier(0.33,1,0.68,1) 0.1875s both;
}
.zr0-cls-6 {
animation:zr0-ani-6 0.5s cubic-bezier(0.33,1,0.68,1) 0.125s both;
}
.zr0-cls-7 {
animation:zr0-ani-7 0.5s cubic-bezier(0.33,1,0.68,1) 0.0625s both;
}
@keyframes zr0-ani-0 {
0% {
transform:scale(0,0);
}
100% {

}
}
@keyframes zr0-ani-1 {
0% {
transform:scale(0,0);
}
100% {

}
}
@keyframes zr0-ani-2 {
0% {
transform:scale(0,0);
}
100% {

}
}
@keyframes zr0-ani-3 {
0% {
transform:scale(0,0);
}
100% {

}
}
@keyframes zr0-ani-4 {
0% {
transform:scale(0,0);
}
100% {

}
}
@keyframes zr0-ani-5 {
0% {
transform:scale(0,0);
}
100% {

}
}
@keyframes zr0-ani-6 {
0% {
transform:scale(0,0);
}
100% {

}
}
@keyframes zr0-ani-7 {
0% {
transform:scale(0,0);
}
100% {

}
}

.home-landing-animation-cover {
  position: relative;
  width: 150px;
  height: 150px;
  margin-top: 30px;
}
#play-landing-animation {
  position: absolute;
  top: 54px;
  left: 54px;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  color: #F72C5B;
  cursor: pointer;
  z-index: 10;
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1) -webkit-transform;
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1) transform;
  transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1) transform, 0.5s cubic-bezier(0.075, 0.82, 0.165, 1) -webkit-transform;
  &:before {
    animation: fx-plyr-play-button 1.5s ease-out infinite;
    border: 4px solid #F72C5B;
    border-radius: 150%;
    box-shadow: 0 0 10px #F72C5B;
    box-sizing: border-box;
    content: "";
    height: 440%;
    left: -170%;
    position: absolute;
    top: -170%;
    width: 440%;
  }
}
@keyframes fx-plyr-play-button {
    0% {
        transform: scale(0.5)
    }

    to {
        opacity: 0
    }
}

</style>
