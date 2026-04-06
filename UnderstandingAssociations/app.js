const sequelize = require('./config/db');
const Student = require('./models/Student');
const Course = require('./models/Course');
const StudentCourse = require('./models/StudentCourse');

Student.belongsToMany(Course, { through: StudentCourse });
Course.belongsToMany(Student, { through: StudentCourse });

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  const s1 = await Student.create({ name: 'Aman' });
  const s2 = await Student.create({ name: 'Neha' });

  const c1 = await Course.create({ title: 'Node.js' });
  const c2 = await Course.create({ title: 'MySQL' });

  await s1.addCourses([c1, c2]);
  await s2.addCourse(c1);

  process.exit();
})();
