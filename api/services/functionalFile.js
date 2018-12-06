const promiseWaterfall = require('../util/promise_waterfall');

function getData(data, cb) {
    
    var configparamarray = app.models.Consumer.configparamarray;
    data.configparamarray = configparamarray;
    log.trace('getData called ', data);
    if (!data.Issues) {
        data.Issues = [{
            IssueText: 'Other'
        }];
    }
    // log.info(' data.ScheduledToTime', data.ScheduledToTime);
    // log.info(' data.ScheduledFromTime', data.ScheduledFromTime);
    var time = moment("1974-01-01 " + data.ScheduledToTime, "YYYY-MM-DD HH:mm:ss");
    var fromtime = moment("1974-01-01 " + data.ScheduledFromTime, "YYYY-MM-DD HH:mm:ss");
    ////////// -------------- Running all functions in waterfall model to execute all one after another in sequence
    promiseWaterfall([
        getManagerID,
        getCompanyId,
        getDepartment,
        getConsumer,
        getJobType,
        getJobTypeResult,
        getTeam,
        getCompanyData,
        getEmployeeAddress,
        getIntegratedCompanydetails,
        getCompanyLogistics,
        getCompanyDepartments,
        getCompanyLocation,
        getCompanyLocationId
    ], data)
    .then(response => cb(null, response))
    .catch(err => cb(err))
}
    function getManagerID(options ={}){
        let {ManagerID} = options.data;
        return new Promise(function(resolve, reject){
            if(ManagerID){
                options.managerObj = app.models.Manager.findById(ManagerID);
                 resolve({options})
            }
            else {
                 reject({
                    success: true,
                    msg: 'No Data To Return',
                    data: {}
                });
            }
        })
    }

    function getCompanyId(options = {}){
        let {managerObj} = options
        if (managerObj)
             app.models.Company.findById(managerObj.CompanyID)
             .then (response=> {
                 options.companyResult = response
                 resolve ({options})
                })
            .catch(err =>reject({message: 'Error in getData 7', error: err}))
    } 
    
    function getDepartment(options = {}){
        let {companyResult, managerObj} = options;
        app.models.Department.findById(managerObj.DepartmentID)
        .then(response =>{
            options.deptObj = response
            resolve({options})
        })
        .catch(err =>reject({message: 'Error in getData 6', error: err}))
    }

    function getConsumer(options = {}){
        let {deptObj, companyResult, data} = options;
        if (companyResult)
            data.CompanyName = companyResult.CompanyName;
         app.models.Consumer.findById(data.ConsumerID)
         .then(response =>{
            options.consumerObj = response
            resolve({options})
        })
         .catch(err =>reject({message: 'Error in getData 5', error: err}))   
    }

    function getJobType(options = {}){
        let {consumerObj, data} = options;
        app.models.JobType.findOne({
            where: {
                JobTypeID: data.JobTypeID
            }
        })
        .then(response =>{
            options.jobTypeResult = response
            resolve({options})
        })
        .catch(err =>reject({message: 'Error in getData 4', error: err}))
    }

    function getJobTypeResult(options = {}){
        let {jobTypeResult, deptObj} = options;
        app.models.Subcategory.findOne({
            where: {
                SubCategoryID: deptObj.SubCategoryID
            }
        })
        .then(response =>{
            options.subcategoryResult = response
            resolve({options})
        })
        .catch(err =>reject({message: 'Error in getData 3', error: err}))
    }

    function getTeam(options ={}){
        let {subcategoryResult, managerObj} = options;
        app.models.Team.findOne({
            where: {
                DepartmentID: managerObj.DepartmentID
            }
        })
        .then(response =>{
            options.teamResult = response
            resolve({options})
        })
        .catch(err =>reject({message: 'Error in getData 2', error: err}))
    }

    function getCompanyData(options = {}){
        let {teamResult, managerObj} = options;
        app.models.CompanyData.findOne({
            where: {
                DepartmentID: managerObj.DepartmentID
            }
        })
        .then(response =>{
            options.companyDataResult = response
            resolve({options})
        })
        .catch(err =>reject({message: 'Error in getData 1', error: err}))
    }

    function getEmployeeAddress(options ={}){
        let {companyDataResult, data} = options;
        app.models.EmployeeAddress.findOne({
            where: {
                Landmark: data.Landmark,
                Address: data.Address
            }
        })
        .then(response =>{
            options.empAddressObj = response
            resolve({options})
        })
        .catch(err =>reject({message: 'Error in getData', error: err}))
    }

    function getIntegratedCompanydetails(options = {}){
        let {empAddressObj, data} = options;
        app.models.IntegratedCompanyDetails.findOne({
            where: {
                ConsumerID: data.ConsumerID
            }
        })
        .then(response =>{
            options.integratedCompanyDetails = response
            resolve({options})
        })
        .catch(err =>reject({message: 'Error in getData', error: err}))
    }

    function getCompanyLogistics(options = {}){
        let {integratedCompanyDetails, data} = options;
        app.models.CompanyLogistics.findOne({
            where: {
                CompanyID: data.CompanyID
            }
        })
        .then(response =>{
            options.companyLogisticsObj = response
            resolve({options})
        })
        .catch(err =>reject({message: 'Error in getData', error: err}))
    }

    function getCompanyDepartments(options = {}){
        let {companyLogisticsObj, data} = options;
        app.models.CompanyDepartments.find({
            where: {
                DepartmentID: data.DepartmentID
            }
        })
        .then(response =>{
            options.companyDeptList = response
            resolve({options})
        })
        .catch(err =>reject({message: 'Error in getData', error: err}))
    }

    function getCompanyLocation(options = {}){
        let {companyDeptList, data} = options;
        app.models.CompanyLocation.findOne({
            where: {
                CompanyLocationID: data.CompanyLocationID
            }
        })
        .then(response =>{
            options.companyLocationObj = response
            resolve({options})
        })
        .catch(err =>reject({message: 'Error in getData', error: err}))
    }

    function getCompanyLocationId(options = {}){
        let {companyLocationObj, consumerObj, data, managerObj, deptObj, companyResult, jobTypeResult, companyLogisticsObj, subcategoryResult, teamResult, companyDataResult, integratedCompanyDetails, companyDeptList} = options;
        var resObj = {};
        resObj = companyLocationObj;
        // log.info(' data.ScheduledToTime', data.ScheduledToTime);
        // log.info(' data.ScheduledFromTime', data.ScheduledFromTime);
        // var time = moment("1974-01-01 " + data.ScheduledToTime, "YYYY-MM-DD HH:mm:ss");
        // var fromtime = moment("1974-01-01 " + data.ScheduledFromTime, "YYYY-MM-DD HH:mm:ss");
        // log.info('time',time);
        // log.info('fromtime',fromtime);
        resObj.slotEndTime = moment(time, "YYYY-MM-DD HH:mm:ss").add(parseFloat("5.5"), 'hours').format("h:mm A").toString();
        resObj.slotStartTime = moment(fromtime, "YYYY-MM-DD HH:mm:ss").add(parseFloat("5.5"), 'hours').format("h:mm A").toString();
        // log.info('resObj.slotEndTime',resObj.slotEndTime);
        // log.info('resObj.slotStartTime',resObj.slotStartTime);
        resObj.Name = consumerObj.Name;
        resObj.EmailID = consumerObj.EmailID;
        resObj.MobileNo = consumerObj.MobileNo;
        resObj.SupplierJobNumber = data.ReferenceID;
        resObj.ModelNo = managerObj.ModelNo;
        resObj.DepartmentName = deptObj.DepartmentName;
        resObj.CompanyName = companyResult.CompanyName;
        if (managerObj.CompanyID == 16 && data.JobTypeID == 5 || data.JobTypeID == 6) {
            resObj.ServiceType = 'Demo / Installation';

        } else {
            resObj.ServiceType = jobTypeResult.Type;
        }
        if (companyLocationObj) {
            resObj.serviceLocationEmail = companyLocationObj.EmailID;
        }
        if (data.PartnerID && data.configparamarray) {
            var selectedObj = _.find(data.configparamarray['ServiceLocationFilter'], {
                PartnerID: data.PartnerID
            })
            if (selectedObj) {
                resObj.OnboardedFrom = selectedObj.OnboardedFrom;
            }
        }
        resObj.DepartmentSubCategory = subcategoryResult.DepartmentSubCategory;
        resObj.DepartmentSubCategoryID = deptObj.DepartmentSubCategoryID;
        resObj.scheduleDate = moment(data.ScheduledDateTime).format('YYYY-MM-DD');
        resObj.DownloadedDeviceUniqueKey = managerObj.DownloadedDeviceUniqueKey;
        resObj.ZipCode = data.Zipcode;
        if (companyLogisticsObj) {
            resObj.VendorName = companyLogisticsObj.Vendor;
        } else {
            log.info('no logistics details found');
        }
        if (managerObj.DepartmentUniqueID) {
            resObj.DepartmentUniqueID = managerObj.DepartmentUniqueID;
        }
        if (empAddressObj) {
            resObj.ZipCode = empAddressObj.Zipcode;
        }
        if (managerObj.AlternateUniqueKey) {
            resObj.AlternateDepartmentUniqueID = managerObj.AlternateUniqueKey;
        }
        if (teamResult) {
            resObj.Department = teamResult.Department;
        }
        if (companyDataResult) {
            resObj.DepartmentCategoryCode = companyDataResult.DepartmentCategoryCode;
        }
        if (integratedCompanyDetails) {
            resObj.cmiRelationShipNo = integratedCompanyDetails.IntegratedConsumerID;
        }
        resObj.AlternateMobileNo = consumerObj.AlternateMobileNo;
        resObj.IsUnderWarranty = managerObj.IsUnderWarranty;
        if (managerObj.DateOfPurchase) {
            resObj.DateOfPurchase = moment(managerObj.DateOfPurchase).format('YYYY-MM-DD');
            resObj.DOP = moment(managerObj.DateOfPurchase).format('YYYY/M/DD');
        }
        if (data.DealerName) {
            resObj.DealerName = data.DealerName;
        }
        if (data.ModelNo) {
            resObj.ModelNo = data.ModelNo;
        }
        if (data.Remarks) {
            data.Remarks = JSON.parse(data.Remarks);
            resObj.wayBillNumber = data.Remarks.waybill;
        }
        console.log('companyDeptList companyDeptList ', companyDeptList);
        if (companyDeptList && companyDeptList.length) {
            resObj.issueText = _.map(companyDeptList, 'IssueText');
        }
        if (data.Issues && data.Issues.length && !companyDeptList.length) {
            resObj.issueText = _.map(data.Issues, 'IssueText');
        }
        console.log('GET DATA RESULT +++++++---->++++++', resObj);
        resolve(null, {
            success: true,
            msg: 'Data obtained',
            data: resObj
        });
    }