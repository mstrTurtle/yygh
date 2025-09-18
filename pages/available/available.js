Page({
    data: {
      // Tab控制
      activeTab: 0,
      
      // 部门数据
      departments: [
        { id: 1, name: "部门一" },
        { id: 2, name: "部门二" },
        { id: 3, name: "部门三" },
        { id: 4, name: "部门四" },
        { id: 5, name: "部门五" }
      ],
      selectedDepartment: null,
      
      // 号源选择
      selectedSlot: null,
      slots: [
        {id:1, name: "2025年1月2日上午XXX时-XXX时"},
        {id:2, name: "2025年2月2日上午XXX时-XXX时"},
        {id:3, name: "2025年3月2日上午XXX时-XXX时"},
      ],
      dateTimeVisible: false,
      minDate: new Date().getTime(),
      maxDate: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30天后
      currentDateTime: new Date().getTime(),
      dateTimeText: "",
      selectedDateTime: null,
      
      // 预约信息
      appeal: "",
      contactName: "",
      contactPhone: "",
      contactIdCard: "",
      companions: [],
      
      // 预约查询
      reservationList: [],
      loading: false,
      detailVisible: false,
      currentDetail: null
    },
    
    onLoad() {
      // 页面加载时获取预约列表
      this.fetchReservations();
    },
    
    // Tab切换
    onTabChange(event) {
      this.setData({
        activeTab: event.detail
      });
      
      // 如果切换到查询页，刷新数据
      if (event.detail === 1) {
        this.fetchReservations();
      }
    },
    
    // 部门选择变化
    onDepartmentChange(event) {
      this.setData({
        selectedDepartment: event.detail,
        // 重置后续选项
        selectedDateTime: null,
        dateTimeText: "",
        appeal: "",
        contactName: "",
        contactPhone: "",
        contactIdCard: "",
        companions: []
      });
    },
    

    onSlotChange(event){
        this.setData({
            selectedSlot : event.detail
        });
    },
    
    
    // 诉求内容变化
    onAppealChange(event) {
      this.setData({
        appeal: event.detail
      });
    },
    
    // 联系人姓名变化
    onContactNameChange(event) {
      this.setData({
        contactName: event.detail
      });
    },
    
    // 联系人电话变化
    onContactPhoneChange(event) {
      this.setData({
        contactPhone: event.detail
      });
    },
    
    // 联系人身份证变化
    onContactIdCardChange(event) {
      this.setData({
        contactIdCard: event.detail
      });
    },
    
    // 添加同行人
    addCompanion() {
      if (this.data.companions.length < 4) {
        const newCompanions = [...this.data.companions, { idCard: "" }];
        this.setData({
          companions: newCompanions
        });
      }
    },
    
    // 移除同行人
    removeCompanion(event) {
      const index = event.currentTarget.dataset.index;
      const newCompanions = this.data.companions.filter((_, i) => i !== index);
      this.setData({
        companions: newCompanions
      });
    },
    
    // 同行人身份证变化
    onCompanionIdChange(event) {
      const index = event.currentTarget.dataset.index;
      const value = event.detail;
      const newCompanions = [...this.data.companions];
      newCompanions[index].idCard = value;
      this.setData({
        companions: newCompanions
      });
    },
    
    // 检查是否可以提交
    canSubmit() {
      const { 
        selectedDepartment, 
        selectedDateTime, 
        appeal, 
        contactName, 
        contactPhone, 
        contactIdCard 
      } = this.data;
      
      // 基本信息验证
      if (!selectedDepartment || !selectedSlot || !appeal || !contactName || !contactPhone || !contactIdCard) {
        return false;
      }
      
    //   // 验证手机号
    //   if (!/^1[3-9]\d{9}$/.test(contactPhone)) {
    //     return false;
    //   }
      
    //   // 验证身份证号(简单验证)
    //   if (!/^\d{17}[\dXx]$/.test(contactIdCard)) {
    //     return false;
    //   }
      
    //   // 验证所有已填写的同行人身份证
    //   for (const companion of this.data.companions) {
    //     if (companion.idCard && !/^\d{17}[\dXx]$/.test(companion.idCard)) {
    //       return false;
    //     }
    //   }
      
      return true;
    },
    
    // 提交预约
    submitReservation() {
      if (!this.canSubmit()) {
        wx.showToast({
          title: '请完善并检查信息',
          icon: 'none'
        });
        return;
      }
      
      // 构造预约数据
      const reservationData = {
        departmentId: this.data.selectedDepartment,
        departmentName: this.data.departments.find(dept => dept.id === this.data.selectedDepartment).name,
        dateTime: this.data.dateTimeText,
        appeal: this.data.appeal,
        contactName: this.data.contactName,
        contactPhone: this.data.contactPhone,
        contactIdCard: this.data.contactIdCard,
        companions: this.data.companions.filter(c => c.idCard) // 过滤空的同行人
      };
      
      // 模拟提交到服务器
      wx.showLoading({ title: '提交中...' });
      
      // 实际项目中这里应该是wx.request调用
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({
          title: '预约提交成功',
          icon: 'success'
        });
        
        // 重置表单
        this.setData({
          selectedDepartment: null,
          selectedDateTime: null,
          dateTimeText: "",
          appeal: "",
          contactName: "",
          contactPhone: "",
          contactIdCard: "",
          companions: []
        });
        
        // 切换到查询页
        this.setData({ activeTab: 1 });
        // 刷新预约列表
        this.fetchReservations();
      }, 1000);
    },
    
    // 获取预约列表
    fetchReservations() {
      this.setData({ loading: true });
      
      // 模拟从服务器获取数据
      // 实际项目中这里应该是wx.request调用
      setTimeout(() => {
        // 模拟数据
        const mockData = [
          {
            id: 1,
            departmentName: "部门一",
            dateTime: "2023-06-15 10:00",
            contactName: "张三",
            contactPhone: "13800138000",
            appeal: "咨询相关业务办理流程",
            status: "已通过", // 0:已受理, 1:已通过, 2:未通过, 3:已结束
            companions: [
              { idCard: "110101199001011234" }
            ]
          },
          {
            id: 2,
            departmentName: "部门三",
            dateTime: "2023-06-18 14:30",
            contactName: "李四",
            contactPhone: "13900139000",
            appeal: "办理相关证件",
            status: "已受理",
            companions: []
          },
          {
            id: 3,
            departmentName: "部门二",
            dateTime: "2023-06-10 09:15",
            contactName: "王五",
            contactPhone: "13700137000",
            appeal: "反馈相关问题",
            status: "已结束",
            companions: [
              { idCard: "310101199203045678" },
              { idCard: "440101199506078901" }
            ]
          }
        ];
        
        this.setData({
          reservationList: mockData,
          loading: false
        });
      }, 1000);
    },
    
    // 显示预约详情
    showReservationDetail(event) {
      const id = event.currentTarget.dataset.id;
      const detail = this.data.reservationList.find(item => item.id === id);
      
      if (detail) {
        this.setData({
          currentDetail: detail,
          detailVisible: true
        });
      }
    },
    
    // 关闭详情弹窗
    closeDetailPopup() {
      this.setData({
        detailVisible: false,
        currentDetail: null
      });
    },
    
    // 获取状态样式类
    getStatusClass(status) {
      switch(status) {
        case 0: return "status-pending";
        case 1: return "status-approved";
        case 2: return "status-rejected";
        case 3: return "status-completed";
        default: return "";
      }
    }
  });
  