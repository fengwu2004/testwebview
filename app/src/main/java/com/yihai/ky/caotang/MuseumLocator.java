package com.yihai.ky.caotang;
import com.aprilbrother.aprilbrothersdk.Beacon;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class MuseumLocator {

	private Map<String,Integer> mark;
	private int currentArea=0;
	private int preMax=0;
	private int maxGain=0;
	private List<POI> list=new ArrayList<>();

	public MuseumLocator() {

		initData();
	}

	private void initData(){
		mark=new HashMap<>();
		//围栏警报
		mark.put("16160:19253",1);
		mark.put("16160:19136",1);
		mark.put("30000:10052",1);
		mark.put("30000:10083",1);
		mark.put("16160:19236",1);
		mark.put("16160:19140",1);
		mark.put("16160:17631",1);
		mark.put("16160:19144",1);
		mark.put("16160:17663",1);
		mark.put("16160:19235",1);
		//唐代遗址
		mark.put("30000:10044",3);
		mark.put("30000:10047",3);
		mark.put("30000:10002",3);
		mark.put("30000:10050",3);
		mark.put("30000:10024",3);
		mark.put("30000:10039",3);
		//唐代遗址外
		mark.put("30000:10010",101);
		mark.put("30000:10004",101);
		mark.put("30000:10049",101);
		mark.put("16160:17665",101);
		//唐亭台遗址
		mark.put("30000:10065",4);
		mark.put("30000:10068",4);
		//唐亭台遗址外
		mark.put("16160:19128",102);
		mark.put("16160:23822",102);
		//茅屋大门
		mark.put("16160:19133",5);
		mark.put("16160:19151",5);
		//茅屋大门外
		mark.put("16160:19252",116);
		mark.put("16160:19129",103);
		//茅屋小门
		mark.put("16160:19130",6);
		mark.put("16160:19135",6);
		//茅草屋
		mark.put("16160:17639",7);
		mark.put("16160:19134",7);
		//茅屋房间1
		mark.put("30000:10006",8);
		mark.put("30000:10059",8);
		mark.put("30000:10074",8);
		//茅屋房间2
		mark.put("30000:10003",9);
		mark.put("30000:10009",9);
		mark.put("30000:10026",9);
		//茅屋房间3
		mark.put("30000:10093",10);
		mark.put("30000:10008",10);
		mark.put("30000:10043",10);
		//茅屋房间4
		mark.put("30000:10053",11);
		mark.put("30000:10055",11);
		mark.put("30000:10036",11);
		mark.put("16160:19239",11);
		//茅屋房间5
		mark.put("30000:10034",12);
		mark.put("30000:10080",12);
		//少陵碑亭
		mark.put("16160:23887",13);
		//工部祠
		mark.put("30000:10025",14);
		mark.put("30000:10054",14);
		//工部祠外
		mark.put("30000:10014",105);
		//恰受航轩
		mark.put("30000:10019",15);
		mark.put("16160:19237",15);
		//恰受航轩外
		mark.put("16160:17665",106);
		//柴门
		mark.put("16160:17644",16);
		mark.put("16160:19148",16);
		//柴门外
		mark.put("16160:19262",104);
		mark.put("16160:19139",104);
		mark.put("16160:9325",104);
		mark.put("16160:18981",104);
		//诗史堂
		mark.put("30000:10063",17);
		mark.put("30000:10098",17);
		mark.put("30000:10058",17);
		mark.put("30000:10070",17);
		//诗史堂外
		mark.put("16160:19260",107);
		mark.put("16160:23824",107);
		//后世陈列室
		mark.put("30000:10062",18);
		mark.put("30000:10067",18);
		//后世陈列室外
		mark.put("16160:23827",108);
		//大廨
		mark.put("30000:10045",19);
		mark.put("16160:17633",19);
		mark.put("16160:17630",19);
		mark.put("16160:23880",19);
		mark.put("30000:10075",19);
		mark.put("16160:19150",19);
		mark.put("16160:23879",19);
		//大廨外
		mark.put("30000:10035",110);
		mark.put("16160:23893",110);
		mark.put("30000:10022",110);
		mark.put("16160:23883",110);
		mark.put("16160:19191",110);
		mark.put("16160:23878",110);
		//诗圣著千秋
		mark.put("30000:10084",20);
		mark.put("30000:10094",20);
		//诗圣著千秋外
		mark.put("16160:19142",109);
		//花径
		mark.put("16160:23886",22);
		mark.put("16160:19216",22);
		mark.put("30000:10032",22);
		mark.put("16160:19385",22);
		mark.put("16160:23823",22);
		mark.put("30000:10066",22);
		mark.put("30000:10101",22);
		mark.put("30000:10102",22);
		//花径外
		mark.put("16160:19186",111);
		//浣花祠
		mark.put("30000:10037",23);
		mark.put("30000:10038",23);
		mark.put("30000:10048",23);
		mark.put("30000:10100",23);
		//盆景园
		mark.put("30000:10099",24);
		mark.put("30000:10042",24);
		mark.put("30000:10031",24);
		mark.put("30000:10041",24);
		mark.put("30000:10027",24);
		mark.put("30000:10064",24);
		//盆景园外
		mark.put("16160:19138",112);
		mark.put("30000:10095",112);
		//影壁
		mark.put("16160:9214",25);
		//大雅堂
		mark.put("30000:10077",26);
		mark.put("30000:10096",26);
		mark.put("30000:10076",26);
		mark.put("30000:10020",26);
		mark.put("30000:10016",26);
		mark.put("30000:10021",26);
		//大雅堂外
		mark.put("30000:10082",113);
		mark.put("30000:10071",113);
		mark.put("16160:19238",113);
		//情系草堂陈列室
		mark.put("30000:10005",27);
		mark.put("16160:19145",27);
		mark.put("30000:10030",27);
		mark.put("16160:19146",27);
		mark.put("16160:17643",27);
		//情系草堂陈列室外
		mark.put("30000:10015",114);
		mark.put("30000:10078",114);
		//万佛楼
		mark.put("30000:10091",29);
		mark.put("30000:10092",29);
		mark.put("16160:17645",29);
		mark.put("16160:19196",29);
		//千诗碑
		mark.put("30000:10061",30);
		mark.put("30000:10086",30);
		mark.put("30000:10033",30);
		mark.put("16160:19147",30);
		mark.put("16160:19149",30);
		mark.put("16160:19141",30);
		mark.put("16160:23888",30);
		mark.put("30000:10023",30);
		//千诗碑外
		mark.put("30000:10081",115);
		mark.put("30000:10011",115);
		mark.put("16160:23825",115);
		mark.put("16160:23889",115);
		//千诗碑二维码
		mark.put("16160:19188",31);
		mark.put("30000:10090",31);
		mark.put("30000:10001",31);
		mark.put("30000:10018",31);
		//千诗碑内的二维码，触发31的事件，认为和30是同一区域，不用互相切换
		mark.put("30000:10012",32);
	}

	public synchronized int getPosition(List<Beacon> beacons) {

		int centerPos = -1;

		if (beacons == null || beacons.size() < 1) {

			if(currentArea==1){

				currentArea=0;
			}

			return centerPos;
		}

		list.clear();

		for(Beacon b:beacons){

			String mac = b.getMajor() + ":" + b.getMinor();

			Integer i = mark.get(mac);

			if (i != null) {

				list.add(new POI(i, b.getRssi(),mac));
			}
		}

		Collections.sort(list, new Comparator<POI>() {
			@Override
			public int compare(POI b1, POI b2) {

				return b2.getRssi()-b1.getRssi();
			}
		});

		if (list.size() < 1) {

			if(currentArea == 1){

				currentArea=0;
			}

			return centerPos;
		}

		//结束测试
		int maxRssi = list.get(0).getRssi();

		if(maxRssi < -92) {

			return centerPos;
		}

		int maxArea = list.get(0).getArea();

		if(maxArea==preMax){

			if (maxGain<5)maxGain++;
		}
		else {
			maxGain=0;
		}

		preMax=maxArea;

		int flag = 1;//是否切换区域

		for(POI p:list) {

			if (maxRssi - p.getRssi() > 8-maxGain) {

				break;
			}

			if(p.getArea() == currentArea){

				flag = 0;

				break;
			}
		}

		if (flag > 0){

			if(maxArea==5||maxArea==6){
				//只在从外部来时触发进入
				if (currentArea<5||currentArea>12)centerPos = maxArea;
			}
			else if(maxArea==7) {
				//只触发8~12过来的情况
				if(currentArea>=8&&currentArea<=12)centerPos = maxArea;
			}
			else if(maxArea==31) {
				//来自32时不用触发
				if(currentArea!=32)centerPos = maxArea;
			}
			else if(maxArea==32) {
				//来自31时不用触发
				if(currentArea!=31)centerPos = 31;
			}
			else if(maxArea>100) {
				//统一认为是室外
				if(currentArea!=1&&currentArea!=31&&currentArea<100)centerPos = 0;
			}
			else{

				centerPos = maxArea;
			}

			currentArea = maxArea;
		}

		return centerPos;
	}


}